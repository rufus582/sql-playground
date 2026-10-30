// Matches the record shape accepted by @redheadphone/react-json-grid, which no
// longer exposes it as a global type.
interface JSONObject {
	// biome-ignore lint/suspicious/noExplicitAny: arbitrary parsed JSON / SQL rows
	[key: string]: any;
}
