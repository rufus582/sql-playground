import * as duckdb from "@duckdb/duckdb-wasm";
import type { JSONGridTabDataProps } from "#ui/code/json-grid-tabs";
import type ISQLDBProps from "./sql.types";

interface SQLStatement {
	text: string;
	keyword: string;
}

// DuckDB reports the affected row count as a single "Count" column for these,
// while SQLite returns no result set, so they are hidden to match.
const ROW_COUNT_KEYWORDS = new Set(["INSERT", "UPDATE", "DELETE"]);

const toDisplayableValue = (value: unknown) => {
	if (typeof value !== "bigint") return value;
	return Number.isSafeInteger(Number(value)) ? Number(value) : `${value}`;
};

const toRecords = (
	table: Awaited<ReturnType<duckdb.AsyncDuckDBConnection["query"]>>,
) =>
	table
		.toArray()
		.map((row) =>
			Object.fromEntries(
				Object.entries(row.toJSON()).map(([key, value]) => [
					key,
					toDisplayableValue(value),
				]),
			),
		) as JSONObject[];

const logger = {
	log: () => {},
};

// The DuckDB WASM binaries are larger than Cloudflare's 25 MiB static asset
// limit, so they are loaded from jsDelivr instead of being self-hosted.
const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

export class DuckDB implements ISQLDBProps {
	db: duckdb.AsyncDuckDB | null = null;
	connection: duckdb.AsyncDuckDBConnection | null = null;

	establishConnection = async () => {
		// Select a bundle based on browser checks
		const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
		// Cross-origin workers can't be constructed directly, so wrap the CDN script
		const workerUrl = URL.createObjectURL(
			new Blob([`importScripts("${bundle.mainWorker}");`], {
				type: "text/javascript",
			}),
		);
		// Instantiate the asynchronous version of DuckDB-wasm
		const worker = new Worker(workerUrl);
		const db = new duckdb.AsyncDuckDB(logger, worker);
		await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
		URL.revokeObjectURL(workerUrl);

		this.db = db;
		this.connection = await db.connect();
		console.log("DuckDB connection established");
	};

	splitStatements = async (script: string) => {
		const statements: SQLStatement[] = [];
		if (!this.db) return statements;

		// Comments produce no tokens and semicolons inside strings belong to the
		// string token, so every ";" operator token ends a statement.
		const { offsets, types } = await this.db.tokenize(script);
		let start = 0;
		let keyword = "";
		offsets.forEach((offset, index) => {
			if (
				types[index] === duckdb.TokenType.OPERATOR &&
				script[offset] === ";"
			) {
				if (keyword) {
					statements.push({ text: script.slice(start, offset + 1), keyword });
				}
				start = offset + 1;
				keyword = "";
				return;
			}
			if (!keyword) {
				keyword = script.slice(offset).match(/^\w+/)?.[0].toUpperCase() ?? "";
			}
		});
		if (keyword) statements.push({ text: script.slice(start), keyword });

		return statements;
	};

	exec = async (script: string) => {
		const resultData: JSONGridTabDataProps[] = [];
		if (!this.connection) return resultData;

		for (const statement of await this.splitStatements(script)) {
			const table = await this.connection.query(statement.text);
			const isRowCount =
				ROW_COUNT_KEYWORDS.has(statement.keyword) &&
				table.schema.fields.length === 1 &&
				table.schema.fields[0]?.name === "Count";
			if (table.numRows === 0 || isRowCount) continue;

			const index = resultData.length;
			resultData.push({
				displayable: `Result ${index + 1}`,
				value: `${index + 1}`,
				content: toRecords(table),
			});
		}

		return resultData;
	};

	run = async (query: string) => {
		await this.connection?.query(query);
	};

	showTables = async () => {
		const result = await this.connection?.query("SHOW TABLES;");
		return result ? toRecords(result) : [];
	};

	close = async () => {
		if (this.connection) {
			await this.connection.close();
			this.connection = null;
			console.log("DuckDB connection closed");
		}
		if (this.db) {
			await this.db.terminate();
			this.db = null;
		}
	};
}
