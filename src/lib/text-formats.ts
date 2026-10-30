import { parquetReadObjects } from "hyparquet";
import CSV from "papaparse";

export interface TextFormatType {
	displayable: string;
	mimeType: string;
	extensions: string[];
	isBinary?: boolean;
	parse: (
		input: string | ArrayBuffer,
	) => object | string | Promise<object | string>;
}

function parseStrBuffer(input: string | ArrayBuffer): string;
function parseStrBuffer(
	input: string | ArrayBuffer,
	parseFunc?: (input: string) => object | string | Promise<object | string>,
): object | string | Promise<object | string>;
function parseStrBuffer(
	input: string | ArrayBuffer,
	parseFunc?: (input: string) => object | string | Promise<object | string>,
) {
	if (input instanceof ArrayBuffer) {
		const decoder = new TextDecoder();
		const inputStr = decoder.decode(input);
		return parseFunc ? parseFunc(inputStr) : inputStr;
	}
	return parseFunc ? parseFunc(input) : input;
}

export const TextFormatsList: TextFormatType[] = [
	{
		displayable: "JSON",
		mimeType: "application/json",
		extensions: ["json"],
		parse: (input) => parseStrBuffer(input, JSON.parse),
	},
	{
		displayable: "CSV",
		mimeType: "text/csv",
		extensions: ["csv"],
		parse: (input) =>
			new Promise((resolve, reject) => {
				const inputStr = parseStrBuffer(input);
				const result = CSV.parse(inputStr, {
					header: true,
				});
				if (result.errors.length > 0) {
					return reject(result.errors.map((error) => error.message));
				}
				if (result.data.length > 0) {
					return resolve(result.data);
				}
				return reject(["There is no CSV data to parse"]);
			}),
	},
	{
		displayable: "PARQUET",
		mimeType: "application/parquet",
		extensions: ["parquet"],
		isBinary: true,
		parse: (input) => {
			if (typeof input === "string")
				throw new Error("Cannot parse PARQUET data from string");

			return parquetReadObjects({ file: input });
		},
	},
] as const;

export const TextFormats = Object.fromEntries(
	TextFormatsList.map((format) => [format.displayable, format]),
) as {
	[K in (typeof TextFormatsList)[number]["displayable"]]: TextFormatType;
};
