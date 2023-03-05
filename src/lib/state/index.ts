import { writable } from "svelte/store";
import { useAwait, usePageDialog } from "$lib/hooks";
import { parse } from "devalue";

export const currentUser = writable<UserState | undefined>();

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
