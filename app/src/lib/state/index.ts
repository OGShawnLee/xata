import type { Tweet, UserLike, UserRetweet, UserState } from "@types";
import { writable } from "svelte/store";
import {
	useAwait,
	useAsideLayout,
	useComposeDialog,
	usePageDialog,
	useWarningDialog
} from "$lib/hooks";
import { parse } from "devalue";
import { useSwitch } from "malachite-ui/hooks";

export const currentUser = writable<UserState | undefined>();

export const currentTweet = writable<Tweet | undefined>();

export const composeDialog = useComposeDialog();

export const newMessageDialog = useSwitch(false);

export const layout = useAsideLayout();

export const tweetLikesDialog = usePageDialog((pathname) => {
	return useAwait(async () => {
		const response = await fetch(pathname);
		const text = await response.text();
		return parse(text) as UserLike[];
	});
});

export const tweetRetweetsDialog = usePageDialog((pathname) => {
	return useAwait(async () => {
		const response = await fetch(pathname);
		const text = await response.text();
		return parse(text) as UserRetweet[];
	});
});

export const warningDialog = useWarningDialog();
