import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import {
	TooltipContent,
	Tooltip as TooltipShadcn,
	TooltipTrigger,
} from "#ui/tooltip";

const tooltipVariants = cva("", {
	variants: {
		variant: {
			primary: "",
			secondary:
				"bg-accent font-semibold text-foreground shadow-black/20 dark:shadow-black/40 shadow-md",
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

interface ITooltipWrapperProps
	extends Omit<React.ComponentProps<typeof TooltipContent>, "content"> {
	content: string;
	children: React.ReactElement;
	open?: boolean;
	defaultOpen?: boolean;
	delayDuration?: number;
	onOpenChange?: (open: boolean) => void;
}

export function Tooltip({
	children,
	content,
	open,
	defaultOpen,
	onOpenChange,
	delayDuration = 700,
	variant,
	className,
	...props
}: ITooltipWrapperProps & VariantProps<typeof tooltipVariants>) {
	return (
		<TooltipShadcn
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={(open) => onOpenChange?.(open)}
		>
			<TooltipTrigger delay={delayDuration} render={children} />
			<TooltipContent
				className={tooltipVariants({ variant, className })}
				{...props}
			>
				{content}
			</TooltipContent>
		</TooltipShadcn>
	);
}
