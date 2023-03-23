import type { Paginated } from "@types";
import type { Expand } from "malachite-ui/types";
import { parse } from "devalue";
import { useAwait } from ".";

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
	return async (page: { cursor: string; more: boolean }) => {
		if (!page.more) return;

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
