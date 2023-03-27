import type { Paginated } from "@types";
import type { Expand } from "malachite-ui/types";
import { parse } from "devalue";
import { useAwait } from ".";
import { onDestroy } from "svelte";

interface Config<T, E = unknown> {
	endpoint: string;
	onError?: (error: E) => void;
	onSuccess: (page: Paginated<T>) => void;
}

export default function useInfiniteScrolling<T, E = unknown>({
	endpoint,
	onError,
	onSuccess
}: Expand<Config<T, E>>) {
	let hasCooldown = false;
	let timeout: NodeJS.Timeout | undefined;

	onDestroy(() => clearTimeout(timeout));

	return async (page: { cursor: string; more: boolean }) => {
		if (!page.more || hasCooldown) return;

		hasCooldown = true;
		timeout = setTimeout(() => (hasCooldown = false), 2500);

		const next = await useAwait<Paginated<T>, E>(async () => {
			const response = await fetch(endpoint + "?cursor=" + page.cursor, {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			const text = await response.text();
			return parse(text) as Paginated<T>;
		});
		if (next.failed) onError?.(next.error);
		else onSuccess(next.data);
	};
}
