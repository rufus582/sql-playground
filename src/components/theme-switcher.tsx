import { motion } from "motion/react";
import { Icon } from "#icons/huge-icon";
import { ComputerIcon, MoonIcon, SunIcon } from "#icons/ui";
import { useTheme } from "#store/theme-provider";
import { Tooltip } from "#ui/custom-components/tooltip-wrapper";
import { ToggleGroup, ToggleGroupItem } from "#ui/toggle-group";

const THEME_OPTIONS = [
	{ value: "light", label: "Light", icon: SunIcon },
	{ value: "dark", label: "Dark", icon: MoonIcon },
	{ value: "system", label: "System", icon: ComputerIcon },
] as const;

type ThemeOption = (typeof THEME_OPTIONS)[number]["value"];

export function ThemeSwitcher() {
	const { theme, setTheme, isSystemTheme } = useTheme();
	const selected: ThemeOption = isSystemTheme ? "system" : theme;

	return (
		<ToggleGroup
			spacing={0}
			aria-label="Theme"
			className="h-7 gap-0.5 rounded-full border border-border bg-muted/50 p-0.5"
			value={[selected]}
			onValueChange={([value]) => {
				if (value) setTheme(value as ThemeOption);
			}}
		>
			{THEME_OPTIONS.map(({ value, label, icon }) => (
				<Tooltip key={value} content={`${label} theme`}>
					<ToggleGroupItem
						value={value}
						aria-label={`${label} theme`}
						className="relative size-6 min-w-0 rounded-full! px-0! text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-transparent aria-pressed:text-foreground"
					>
						{selected === value && (
							<motion.span
								layoutId="theme-switcher-indicator"
								className="absolute inset-0 rounded-full bg-background shadow-xs dark:bg-input"
								transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
							/>
						)}
						<Icon icon={icon} size={14} className="relative" />
					</ToggleGroupItem>
				</Tooltip>
			))}
		</ToggleGroup>
	);
}
