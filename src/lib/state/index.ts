import { writable } from "svelte/store";
import { useAwait, useAsideLayout, useComposeDialog, usePageDialog } from "$lib/hooks";
import { parse } from "devalue";

export const currentUser = writable<UserState | undefined>();

export const currentTweet = writable<TweetObject | undefined>();

export const composeDialog = useComposeDialog();

export const layout = useAsideLayout();

export const tweetLikesDialog = usePageDialog((pathname) => {
	return useAwait(async () => {
		const response = await fetch(pathname);
		const text = await response.text();
		return parse(text) as TweetLikeUserObject[];
	});
});

export const tweetRetweetsDialog = usePageDialog((pathname) => {
	return useAwait(async () => {
		const response = await fetch(pathname);
		const text = await response.text();
		return parse(text) as TweetRetweetUserObject[];
	});
});
