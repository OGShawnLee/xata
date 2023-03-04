import type { Nullable } from "malachite-ui/types";
import { useCleanup, useListener } from "malachite-ui/hooks";
import { useAwait } from "$lib/hooks";
import { parse } from "devalue";
import { onDestroy } from "svelte";
import { ref } from "malachite-ui/utils";
import { isNullish } from "malachite-ui/predicate";

interface State {
	open: boolean;
	state: "FAILED" | "SUCCESS" | "LOADING" | "IDLE";
	likes: TweetLikeUserObject[];
}

export function useTweetLikesDialog() {
	const store = ref<State>({ open: false, state: "IDLE", likes: [] });

	function getTweetLikeUsers(pathname: string) {
		return useAwait(async () => {
			const response = await fetch(pathname);
			const text = await response.text();
			return parse(text) as TweetLikeUserObject[];
		});
	}

	function getLinkAction(this: void, displayName: Nullable<string>, id: string) {
		if (isNullish(displayName)) throw TypeError("Tweet user displayName cannot be nullish!");

		onDestroy(() => reset());

		const pathname = "/" + displayName + "/status/" + id + "/likes";
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

			const likes = await getTweetLikeUsers(pathname);
			if (likes.failed) {
				store.update((state) => {
					state.state = "FAILED";
					return state;
				});
			} else {
				store.update((state) => {
					state.state = "SUCCESS";
					state.likes = likes.data;
					return state;
				});
			}
		});
	}

	function reset() {
		store.update((store) => {
			store.open = false;
			store.state = "IDLE";
			store.likes = [];
			return store;
		});
	}

	return { ...store, getLinkAction };
}
