import { createContext, useContext, useEffect, useState } from "react";
import { useSystemTheme } from "#hooks/use-system-theme";

type Theme = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

type ThemeProviderProps = {
	children: React.ReactNode;
	defaultTheme?: Theme;
	storageKey?: string;
};

type ThemeProviderState = {
	theme: ResolvedTheme;
	setTheme: (theme: Theme) => void;
	isSystemTheme: boolean;
};

const initialState: ThemeProviderState = {
	theme: "" as ResolvedTheme,
	setTheme: () => null,
	isSystemTheme: false,
};

const isTheme = (value: unknown): value is Theme =>
	value === "dark" || value === "light" || value === "system";

const setGlobalTheme = (theme: ResolvedTheme) => {
	const root = window.document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(theme);
};

const getResolvedTheme = (theme: Theme, systemTheme: ResolvedTheme) => {
	return theme === "system" ? systemTheme : theme;
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
}: ThemeProviderProps) {
	const [storedTheme, setStoredTheme] = useState<Theme | null>(null);
	const systemTheme = useSystemTheme();

	const theme = storedTheme ?? defaultTheme;
	const resolvedTheme = getResolvedTheme(theme, systemTheme);

	useEffect(() => {
		const value = window.localStorage.getItem(storageKey);
		if (isTheme(value)) setStoredTheme(value);
	}, [storageKey]);

	useEffect(() => {
		setGlobalTheme(resolvedTheme);
		window.localStorage.setItem(`${storageKey}-resolved`, resolvedTheme);
		document.cookie = `${storageKey}-resolved=${resolvedTheme}; path=/; max-age=${60 * 60 * 24 * 7}`;
	}, [resolvedTheme, storageKey]);

	const setTheme = (theme: Theme) => {
		window.localStorage.setItem(storageKey, theme);
		setStoredTheme(theme);
	};

	const value: ThemeProviderState = {
		theme: resolvedTheme,
		setTheme,
		isSystemTheme: theme === "system",
	};

	return (
		<ThemeProviderContext.Provider value={value}>
			{children}
		</ThemeProviderContext.Provider>
	);
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext);

	if (context === undefined)
		throw new Error("useTheme must be used within a ThemeProvider");

	return context;
};
