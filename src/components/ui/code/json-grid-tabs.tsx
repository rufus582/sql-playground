import { useImperativeHandle, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";
import JSONGrid from "./json-grid";

export interface JSONGridTabDataProps {
	displayable: string;
	value: string;
	content: JSONObject;
}

interface JSONGridTabsRefProps {
	setSelectedTabValue: (tabValue: string) => void;
}

export type JSONGridTabsRefType = React.RefObject<JSONGridTabsRefProps | null>;

interface JSONGridTabsPropsType {
	ref?: JSONGridTabsRefType;
	className?: string;
	tabsData: JSONGridTabDataProps[];
}

const JSONGridTabs = ({ className, tabsData, ref }: JSONGridTabsPropsType) => {
	const [tabValue, setTabValue] = useState<string>(
		`${tabsData[0]?.value}` || "",
	);

	useImperativeHandle(
		ref,
		() => ({
			setSelectedTabValue: setTabValue,
		}),
		[],
	);

	return (
		<Tabs
			className={`gap-0 overflow-hidden flex flex-col border border-border bg-[#ffffff] dark:bg-[#1e1e1e] ${className} `}
			value={tabValue}
			onValueChange={setTabValue}
		>
			<div className="p-2 gap-4 flex bg-muted text-muted-foreground">
				{/*<TabsList className="border border-border bg-background">*/}
				<TabsList variant="line">
					{tabsData.map((tabData) => (
						<TabsTrigger
							key={tabData.value}
							value={tabData.value}
							// className="data-active:bg-muted dark:data-active:border-transparent dark:data-active:bg-muted"
						>
							{tabData.displayable}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			{tabsData.map((tabData) => (
				<TabsContent
					key={tabData.value}
					className="overflow-scroll"
					value={tabData.value}
				>
					<JSONGrid data={tabData.content} className="mt-0 border-0 pt-0" />
				</TabsContent>
			))}
		</Tabs>
	);
};

export default JSONGridTabs;
