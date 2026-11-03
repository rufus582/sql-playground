import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useSyncExternalStore,
} from "react";
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

const storageListeners = new Set<() => void>();

const subscribeToStorage = (cb: () => void) => {
	storageListeners.add(cb);
	window.addEventListener("storage", cb);

	return () => {
		storageListeners.delete(cb);
		window.removeEventListener("storage", cb);
	};
};

const noopSubscribe = () => () => {};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
	children,
	defaultTheme = "system",
	storageKey = "ui-theme",
}: ThemeProviderProps) {
	const storedTheme = useSyncExternalStore(
		subscribeToStorage,
		() => {
			const value = window.localStorage.getItem(storageKey);
			return isTheme(value) ? value : null;
		},
		() => null,
	);
	const systemTheme = useSystemTheme();
	// The first client render reuses server snapshots, so it must not touch the
	// <html> class that the inline head script already set correctly.
	const isHydrated = useSyncExternalStore(
		noopSubscribe,
		() => true,
		() => false,
	);

	const theme = storedTheme ?? defaultTheme;
	const resolvedTheme = getResolvedTheme(theme, systemTheme);

	useEffect(() => {
		if (!isHydrated) return;
		setGlobalTheme(resolvedTheme);
	}, [isHydrated, resolvedTheme]);

	const setTheme = useCallback(
		(theme: Theme) => {
			window.localStorage.setItem(storageKey, theme);
			for (const listener of storageListeners) listener();
		},
		[storageKey],
	);

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
