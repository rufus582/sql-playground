import { useState } from "react";
import { sleep } from "#lib/utils";

export const MIN_PENDING_DURATION_MS = 300;

export function useAsyncAction<Args extends unknown[]>(
	action: (...args: Args) => Promise<unknown>,
) {
	const [isPending, setIsPending] = useState(false);

	const run = async (...args: Args) => {
		setIsPending(true);
		const startedAt = performance.now();
		try {
			await action(...args);
		} finally {
			const elapsed = performance.now() - startedAt;
			await sleep(Math.max(0, MIN_PENDING_DURATION_MS - elapsed));
			setIsPending(false);
		}
	};

	return [isPending, run] as const;
}
