import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { usePanelRef } from "react-resizable-panels";
import { toast } from "sonner";
import { useImmer } from "use-immer";
import { GithubLink } from "#components/github-link";
import { ThemeSwitcher } from "#components/theme-switcher";
import {
	MIN_PENDING_DURATION_MS,
	useAsyncAction,
} from "#hooks/use-async-action";
import { Icon } from "#icons/huge-icon";
import { PlayIcon, TypeCursorIcon } from "#icons/pages";
import { DatabaseIcon } from "#icons/routes";
import { PasteIcon } from "#icons/ui";
import {
	DatabaseLibs,
	type DatabaseType,
	type ISQLDBProps,
	supportedDatabaseTypes,
} from "#lib/sql";
import { getClipboardText, sleep } from "#lib/utils";
import CodeEditor, { type CodeEditorRefType } from "#ui/code/code-editor";
import type {
	JSONGridTabDataProps,
	JSONGridTabsRefType,
} from "#ui/code/json-grid-tabs";
import JSONGridTabs from "#ui/code/json-grid-tabs";
import { MotionButton } from "#ui/custom-components/motion-button";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "#ui/resizable";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Separator } from "#ui/separator";
import { Spinner } from "#ui/spinner";
import {
	type DBConnectionState,
	DBConnectionStatusBadge,
} from "./-db-status-badge";
import { ImportTableForm } from "./-import-table-form";
import { ShowTablesPopUp } from "./-show-tables-popup";

const MotionSelectTrigger = motion.create(SelectTrigger);

interface SQLDataStateType {
	db?: ISQLDBProps;
	sqlCode: string;
	resultData: JSONGridTabDataProps[];
	tables: JSONObject[];
	databaseType: DatabaseType;
}

export const Route = createFileRoute("/")({
	// DuckDB, sql.js and Monaco only run in the browser and break module
	// evaluation in the Workers runtime.
	ssr: false,
	component: RouteComponent,
	pendingComponent: () => (
		<div className="flex h-svh items-center justify-center">
			<Spinner className="size-8" />
		</div>
	),
});

function RouteComponent() {
	const [dbConnectionState, setDbConnectionState] =
		useState<DBConnectionState>("connecting");

	const sqlPanelRef = usePanelRef();
	const [isSQLPanelCollapsed, setIsSQLPanelCollapsed] = useState(false);

	const [sqlDataState, setSQLDataState] = useImmer<SQLDataStateType>({
		db: new DatabaseLibs.DuckDB(),
		sqlCode: "",
		resultData: [],
		tables: [],
		databaseType: "DuckDB",
	});

	const editorRef: CodeEditorRefType = useRef(null);
	const resultViewerRef: JSONGridTabsRefType = useRef(null);

	useEffect(() => {
		const connectDB = async () => {
			setDbConnectionState("connecting");
			const startedAt = performance.now();
			const waitForMinDuration = () =>
				sleep(
					Math.max(
						0,
						MIN_PENDING_DURATION_MS - (performance.now() - startedAt),
					),
				);

			try {
				await sqlDataState.db?.establishConnection();
			} catch (e) {
				console.log(e);
				await waitForMinDuration();
				return setDbConnectionState("error");
			}

			await waitForMinDuration();
			setDbConnectionState("connected");
		};

		connectDB();

		return () => {
			sqlDataState.db?.close();
		};
	}, [sqlDataState.db]);

	useEffect(() => {
		if (sqlDataState.resultData.length > 0)
			resultViewerRef.current?.setSelectedTabValue(
				sqlDataState.resultData[0]?.value,
			);
	}, [sqlDataState.resultData]);

	const runSQLQueryAndUpdateState = async (query: string) => {
		try {
			const resultData = await sqlDataState.db?.exec(query);
			if (resultData && resultData.length > 0) {
				setSQLDataState((state) => {
					state.resultData = resultData;
				});
			}

			toast.success("SQL Query ran successfully!");
		} catch (error) {
			toast.error(`${error}`);
		}
	};

	const onClickRunSQL = async (selection: boolean = false) => {
		try {
			let queryToRun: string = sqlDataState.sqlCode;
			if (selection && editorRef.current) {
				const selection = editorRef.current.getSelection();
				if (selection)
					queryToRun =
						editorRef.current.getModel()?.getValueInRange(selection) ??
						queryToRun;
			}
			if (!queryToRun || queryToRun === "")
				throw new Error("SQL Query is empty!");

			await runSQLQueryAndUpdateState(queryToRun);
		} catch (error) {
			toast.error(`${error}`);
		}
	};

	const handleClipboardPaste = async () => {
		try {
			const value = await getClipboardText();
			setSQLDataState((state) => {
				state.sqlCode = value;
			});
		} catch (error) {
			console.error(error);
			toast.error(`${error}`);
		}
	};

	const [isPasting, paste] = useAsyncAction(handleClipboardPaste);
	const [isRunningSQL, runSQL] = useAsyncAction(() => onClickRunSQL());
	const [isRunningSelected, runSelected] = useAsyncAction(() =>
		onClickRunSQL(true),
	);

	const handleDbChange = async (newDB: DatabaseType) => {
		setSQLDataState((state) => {
			state.db = new DatabaseLibs[newDB]();
			state.databaseType = newDB;
			state.resultData = [];
			state.tables = [];
		});
	};

	const isDisconnected = dbConnectionState !== "connected";

	return (
		<div className="flex flex-col h-svh p-4 gap-4">
			<header className="flex items-center justify-between mx-2">
				<h1 className="flex items-center gap-2 text-xl font-bold text-primary">
					<Icon icon={DatabaseIcon} size={24} />
					SQL Playground
				</h1>
				<div className="flex items-center gap-2">
					<GithubLink />
					<ThemeSwitcher />
				</div>
			</header>
			<Separator className="-mx-4 data-horizontal:w-auto" />
			<div className="flex justify-between">
				<div className="flex gap-2 ml-2">
					<ImportTableForm db={sqlDataState.db} disabled={isDisconnected} />
					<Tooltip content="Paste copied data from clipboard">
						<MotionButton
							variant="outline"
							className="w-fit rounded-full"
							onClick={paste}
							disabled={isDisconnected || isPasting}
						>
							{isPasting ? <Spinner /> : <Icon icon={PasteIcon} />}
							Paste
						</MotionButton>
					</Tooltip>
					<ShowTablesPopUp
						tables={sqlDataState.tables}
						setTables={(tables) =>
							setSQLDataState((state) => {
								state.tables = tables;
							})
						}
						db={sqlDataState.db}
						onClickCellItemAction={runSQLQueryAndUpdateState}
						disabled={isDisconnected}
					/>
					<Select
						onValueChange={(value) => {
							if (value) handleDbChange(value as DatabaseType);
						}}
						value={sqlDataState.databaseType}
					>
						<Tooltip
							content="Select a Database to run SQL"
							variant="secondary"
							delayDuration={0}
						>
							<MotionSelectTrigger
								layout
								transition={{
									duration: 0.15,
								}}
								className="rounded-3xl flex gap-2 py-1! h-full!"
								disabled={dbConnectionState === "connecting"}
							>
								<DBConnectionStatusBadge
									className="-ml-1.5"
									state={dbConnectionState}
								/>
								<SelectValue />
							</MotionSelectTrigger>
						</Tooltip>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Database</SelectLabel>
								{supportedDatabaseTypes.map((dbType) => (
									<SelectItem key={dbType} value={dbType}>
										{dbType}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
				<div className="mr-2 flex gap-2">
					<Tooltip content="Run SQL Query">
						<MotionButton
							className="w-fit rounded-full hover:bg-primary"
							onClick={runSQL}
							disabled={isDisconnected || isRunningSQL}
						>
							{isRunningSQL ? <Spinner /> : <Icon icon={PlayIcon} />}
							Run SQL
						</MotionButton>
					</Tooltip>
					<Tooltip content="Run Selected SQL Query">
						<MotionButton
							className="w-fit rounded-full hover:bg-primary"
							onClick={runSelected}
							disabled={isDisconnected || isRunningSelected}
						>
							{isRunningSelected ? <Spinner /> : <Icon icon={TypeCursorIcon} />}
							Run Selected
						</MotionButton>
					</Tooltip>
				</div>
			</div>
			<ResizablePanelGroup orientation="vertical">
				<ResizablePanel
					panelRef={sqlPanelRef}
					collapsible
					minSize={25}
					onResize={() =>
						setIsSQLPanelCollapsed(sqlPanelRef.current?.isCollapsed() ?? false)
					}
				>
					<CodeEditor
						ref={editorRef}
						className="rounded-t-xl h-full"
						onChange={(value) =>
							setSQLDataState((state) => {
								state.sqlCode = value ?? "";
							})
						}
						title="SQL"
						value={sqlDataState.sqlCode}
						language="sql"
					/>
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel minSize={15} className="overflow-hidden">
					<JSONGridTabs
						ref={resultViewerRef}
						tabsData={
							sqlDataState.resultData.length
								? sqlDataState.resultData
								: [
										{
											displayable: "Result",
											value: "1",
											content: {},
										},
									]
						}
						className={`h-full rounded-b-xl ${
							isSQLPanelCollapsed ? "rounded-t-xl" : ""
						}`}
					/>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
