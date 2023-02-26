import type { UsersRecord } from "$lib/server/xata";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { getTweets } from "./tweet";
import { findBookmark } from "./bookmark";
import { isDefined } from "$lib/utils/predicate";
import { findLike } from "./like";
import { isNullish } from "malachite-ui/predicate";

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

async function findUserPublic(displayName: string) {
	return client.db.users
		.filter("displayName", displayName)
		.select(["createdAt", "displayName", "name"])
		.getFirst();
}

export function getUserPublicPage(displayName: string, currentUser: string | undefined) {
	return useAwait(async () => {
		return Promise.all([findUserPublic(displayName), getUserTweets(displayName, currentUser)]);
	});
}

export function getUserFeed(id: string) {
	return useAwait(async () => {
		const tweets = await getTweets();
		if (tweets.failed) throw tweets.error;
		return Promise.all(
			tweets.data.map(async (tweet) => {
				const [bookmark, like] = await Promise.all([
					findBookmark(id, tweet.id),
					findLike(id, tweet.id)
				]);
				const isBookmarked = bookmark.failed ? false : isDefined(bookmark.data);
				const isLiked = like.failed ? false : isDefined(like.data);
				return { ...tweet, isBookmarked, isLiked };
			})
		);
	});
}

export async function getUserTweets(displayName: string, currentUser: string | undefined) {
	const tweets = await client.db.tweets
		.filter("user.displayName", displayName)
		.select(["*", "user.displayName", "user.name", "user.id"])
		.getAll();

	if (isNullish(currentUser)) return tweets;
	return Promise.all(
		tweets.map(async (tweet) => {
			const [like, bookmark] = await Promise.all([
				findLike(currentUser, tweet?.id!),
				findBookmark(currentUser, tweet.id!)
			]);
			const isLiked = like.failed ? false : isDefined(like.data);
			const isBookmarked = bookmark.failed ? false : isDefined(bookmark.data);

			return { ...tweet, isLiked, isBookmarked };
		})
	);
}
