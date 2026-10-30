export { cn } from "cn";

export const getClipboardText = async () => {
	return new Promise<string>((resolve, reject) => {
		if (!window.navigator.clipboard) {
			return reject("Browser doesn't have support for native clipboard.");
		}

		window.navigator.clipboard
			.readText()
			.then((value) => resolve(value))
			.catch((error) => reject(error));
	});
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getFileExtension = (fileName: string) => {
	return fileName.split(".").at(-1) ?? "";
};
