import type { UsersRecord } from "$lib/server/xata";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { getTweets } from "./tweet";
import { findBookmark } from "./bookmark";
import { isDefined } from "$lib/utils/predicate";

export function createUser(data: Pick<UsersRecord, "displayName" | "email" | "name" | "password">) {
	return useAwait(async () => {
		const user = await client.db.users.create(data);
		return user.toSerializable();
	});
}

export function findUser(displayName: string) {
	return useAwait(async () => {
		const user = await client.db.users.filter("displayName", displayName).getFirst();
		return user?.toSerializable();
	});
}

export function getUserFeed(id: string) {
	return useAwait(async () => {
		const tweets = await getTweets();
		if (tweets.failed) throw tweets.error;
		return Promise.all(
			tweets.data.map(async (tweet) => {
				const bookmark = await findBookmark(id, tweet.id);
				const isBookmarked = bookmark.failed ? false : isDefined(bookmark.data);
				return { ...tweet, isBookmarked };
			})
		);
	});
}
