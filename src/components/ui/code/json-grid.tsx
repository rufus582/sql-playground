import ReactJSONGrid from "@redheadphone/react-json-grid";
import { useTheme } from "#store/theme-provider";

interface JSONGridPropsType {
	className?: string;
	data: JSONObject;
}

const JSONGrid = ({ className, data }: JSONGridPropsType) => {
	const { theme } = useTheme();

	const darkModeTheme = {
		bgColor: "#1e1e1e",
		borderColor: "#3c3c3c",
		selectHighlightBgColor: "#264f7870",
		cellBorderColor: "#333333",
		keyColor: "#9cdcfe",
		indexColor: "#cccccc",
		numberColor: "#b5cea8",
		booleanColor: "#569cd6",
		stringColor: "#ce9178",
		objectColor: "#dcdcdc",
		tableHeaderBgColor: "#252526",
		tableIconColor: "#ffffff00",
		searchHighlightBgColor: "#613214",
	};

	const lightModeTheme = {
		bgColor: "#ffffff",
		borderColor: "#e1e1e1",
		selectHighlightBgColor: "#add6ff70",
		cellBorderColor: "#dcdcdc",
		keyColor: "#001080",
		indexColor: "#333333",
		numberColor: "#098658",
		booleanColor: "#0000ff",
		stringColor: "#a31515",
		objectColor: "#000000",
		tableHeaderBgColor: "#f3f3f3",
		tableIconColor: "#33333300",
		searchHighlightBgColor: "#fffbdd",
	};

	return (
		<div
			className={`overflow-hidden flex flex-col border border-border bg-[#ffffff] dark:bg-[#1e1e1e] ${className}`}
		>
			<div className="overflow-scroll">
				<ReactJSONGrid
					data={data}
					customTheme={theme === "dark" ? darkModeTheme : lightModeTheme}
				/>
			</div>
		</div>
	);
};

export default JSONGrid;
