import { createMiddleware, createStart } from "@tanstack/react-start";

const securityHeaders = {
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
	"X-XSS-Protection": "1; mode=block",
};

const responseHeadersMiddleware = createMiddleware().server(
	async ({ next }) => {
		const result = await next();
		const { headers } = result.response;

		for (const [name, value] of Object.entries(securityHeaders)) {
			headers.set(name, value);
		}
		if (headers.get("Content-Type")?.startsWith("text/html")) {
			headers.set("Cache-Control", "public, max-age=0, must-revalidate");
		}

		return result;
	},
);

export const startInstance = createStart(() => ({
	requestMiddleware: [responseHeadersMiddleware],
}));
