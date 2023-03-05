import type { Nullable } from "malachite-ui/types";
import { useCleanup, useListener } from "malachite-ui/hooks";
import { onDestroy } from "svelte";
import { ref } from "malachite-ui/utils";
import { isNullish } from "malachite-ui/predicate";

interface State<T> {
	open: boolean;
	state: "FAILED" | "SUCCESS" | "LOADING" | "IDLE";
	data: T[];
}

export function usePageDialog<T, E>(
	load: (pathname: string) => Promise<{ failed: true; error: E } | { failed: false; data: T[] }>
) {
	const store = ref<State<T>>({ open: false, state: "IDLE", data: [] });

	function getLinkAction(this: void, displayName: Nullable<string>, id: string, route: string) {
		if (isNullish(displayName)) throw TypeError("Tweet user displayName cannot be nullish!");

		onDestroy(() => reset());

		const pathname = "/" + displayName + "/status/" + id + route;
		return (element: HTMLAnchorElement) => {
			return {
				destroy: useCleanup(handleClick(element), handleMouseEnter(element, pathname))
			};
		};
	}

	function handleClick(element: HTMLAnchorElement) {
		return useListener(element, "click", (event) => {
			event.preventDefault();
			store.update((store) => {
				store.open = true;
				return store;
			});
		});
	}

	function handleMouseEnter(element: HTMLElement, pathname: string) {
		return useListener(element, "mouseenter", async () => {
			if (store.value.state === "SUCCESS") return;

			store.update((store) => {
				store.state = "LOADING";
				return store;
			});

			const result = await load(pathname);
			if (result.failed) {
				store.update((state) => {
					state.state = "FAILED";
					return state;
				});
			} else {
				store.update((state) => {
					state.state = "SUCCESS";
					state.data = result.data;
					return state;
				});
			}
		});
	}

	function reset() {
		store.update((store) => {
			store.open = false;
			store.state = "IDLE";
			store.data = [];
			return store;
		});
	}

	return { ...store, getLinkAction };
}
