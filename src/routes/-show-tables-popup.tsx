import { useState } from "react";
import { toast } from "sonner";
import { useAsyncAction } from "#hooks/use-async-action";
import { Icon } from "#icons/huge-icon";
import { DeleteIcon, MoreHorizontalIcon, ViewIcon } from "#icons/ui";
import type { ISQLDBProps } from "#lib/sql";
import { Button } from "#ui/button";
import { MotionButton } from "#ui/custom-components/motion-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";
import { Spinner } from "#ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "#ui/table";

interface ShowTablesPopUpProps {
	tables: JSONObject[];
	setTables: (tables: JSONObject[]) => void;
	db?: ISQLDBProps;
	onClickCellItemAction: (query: string) => Promise<void> | void;
	disabled?: boolean;
}

const ShowTablesPopUp = ({
	tables,
	setTables,
	db,
	onClickCellItemAction,
	disabled,
}: ShowTablesPopUpProps) => {
	const [isShowTablesPopoverOpen, setIsShowTablesPopoverOpen] = useState(false);

	const handleShowTables = async (showWarning: boolean = true) => {
		const tablesList = await db?.showTables();
		if (tablesList && tablesList.length > 0) {
			setTables(tablesList);
			setIsShowTablesPopoverOpen(true);
			return;
		}

		if (showWarning) toast.warning("No tables found, please create one!");

		setTables([]);
		setIsShowTablesPopoverOpen(false);
	};

	const [isLoadingTables, showTables] = useAsyncAction(handleShowTables);

	const handleOpenChange = (open: boolean) => {
		// Opening waits for the table list so an empty result never flashes the popup
		if (open) showTables();
		else setIsShowTablesPopoverOpen(false);
	};

	const handleCellItemAction = async (query: string) => {
		await onClickCellItemAction(query);
		handleShowTables(false);
	};

	return (
		<Popover
			modal
			open={isShowTablesPopoverOpen}
			onOpenChange={handleOpenChange}
		>
			<PopoverTrigger
				render={
					<MotionButton
						variant="outline"
						className="w-fit rounded-full"
						disabled={disabled || isLoadingTables}
					/>
				}
			>
				{isLoadingTables ? <Spinner /> : <Icon icon={ViewIcon} />}
				Show Tables
			</PopoverTrigger>
			<PopoverContent
				className="rounded-xl p-0 gap-0 relative h-37.5 overflow-scroll overscroll-y-contain **:data-[slot=table-container]:overflow-visible"
				align="center"
			>
				<Table>
					<TableHeader>
						<TableRow className="*:px-4 h-12 sticky top-0 bg-background hover:bg-muted">
							<TableHead>Table Name</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tables.map(({ name }) => {
							return (
								<TableRow className="*:px-4 h-10" key={name}>
									<TableCell>{name}</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger
												render={
													<Button
														variant="ghost"
														size="icon"
														className="size-8"
													/>
												}
											>
												<Icon icon={MoreHorizontalIcon} />
												<span className="sr-only">Open menu</span>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														handleCellItemAction(`select * from ${name}`)
													}
												>
													<Icon icon={ViewIcon} />
													View Records
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													variant="destructive"
													onClick={() =>
														handleCellItemAction(`drop table ${name}`)
													}
												>
													<Icon icon={DeleteIcon} />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</PopoverContent>
		</Popover>
	);
};

export { ShowTablesPopUp };
