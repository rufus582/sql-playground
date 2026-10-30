import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import type React from "react";
import { cn } from "#lib/utils";
import { useTheme } from "#store/theme-provider";
import { Skeleton } from "#ui/skeleton";
import { Spinner } from "#ui/spinner";
import "./code-editor-overrides.css";

export type CodeEditorRefType =
	React.RefObject<editor.IStandaloneCodeEditor | null>;

interface ICodeEditorProps {
	title?: string;
	className?: string;
	onChange?: (value?: string) => void;
	value?: string;
	language?: string;
	ref?: CodeEditorRefType;
}

const CodeEditor = ({
	title,
	className,
	ref,
	...editorProps
}: ICodeEditorProps) => {
	const { theme } = useTheme();

	const handleEditorDidMount: OnMount = (editor) => {
		if (ref) ref.current = editor;
	};

	return (
		<div
			className={cn(
				className,
				"border border-border flex flex-col overflow-hidden relative",
			)}
		>
			<div className="p-2 px-4 min-h-12 flex items-center bg-muted text-muted-foreground">
				{title && <span>{title}</span>}
			</div>
			<div className="flex-1 relative" style={{ containerType: "inline-size" }}>
				<Editor
					{...editorProps}
					options={{
						minimap: { enabled: false },
						wordWrap: "on",
						lineNumbers: "on",
						unusualLineTerminators: "auto",
					}}
					loading={
						<Skeleton className="h-full w-full flex rounded-none">
							<Spinner className="m-auto size-8" />
						</Skeleton>
					}
					theme={theme === "dark" ? "vs-dark" : "light"}
					onMount={handleEditorDidMount}
				/>
			</div>
		</div>
	);
};

export default CodeEditor;
