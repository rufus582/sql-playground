import {
	createRootRoute,
	type ErrorComponentProps,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "#store/theme-provider";
import { Toaster } from "#ui/sonner";
import { TooltipProvider } from "#ui/tooltip";
import appCss from "../styles.css?url";

const THEME_STORAGE_KEY = "ui-theme";

const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}-resolved');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "SQL Playground",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/favicon.ico",
			},
		],
	}),
	shellComponent: RootDocument,
	errorComponent: RootError,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: avoids theme flicker on page load
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
			</head>
			<body>
				<ThemeProvider storageKey={THEME_STORAGE_KEY}>
					<MotionConfig reducedMotion="user">
						<TooltipProvider>
							<Toaster closeButton richColors />
							{children}
						</TooltipProvider>
					</MotionConfig>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}

function RootError({ error }: ErrorComponentProps) {
	return (
		<main className="flex h-svh flex-col items-center justify-center gap-2 p-4 text-center">
			<h1 className="text-xl font-semibold">Something went wrong</h1>
			<p className="text-muted-foreground">
				{error instanceof Error ? error.message : String(error)}
			</p>
		</main>
	);
}

function NotFound() {
	return (
		<main className="flex h-svh flex-col items-center justify-center gap-2 p-4 text-center">
			<h1 className="text-xl font-semibold">Page not found</h1>
			<p className="text-muted-foreground">
				The page you are looking for does not exist.
			</p>
		</main>
	);
}
