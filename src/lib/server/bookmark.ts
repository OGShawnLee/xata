import client from "./client";
import { useAwait } from "$lib/hooks";
import { findLike } from "./like";
import { isDefined } from "$lib/utils/predicate";

export function createBookmark(userId: string, tweetId: string) {
	return useAwait(() => {
		return client.db.bookmarks.create({ tweet: { id: tweetId }, user: { id: userId } });
	});
}

export function deleteBookmark(id: string) {
	return useAwait(() => {
		return client.db.bookmarks.deleteOrThrow(id);
	});
}

export function findBookmark(userId: string, tweetId: string) {
	return useAwait(async () => {
		const bookmark = await client.db.bookmarks
			.filter({ "tweet.id": tweetId, "user.id": userId })
			.getFirst();
		return bookmark?.toSerializable();
	});
}

export function getBookmarks(userId: string) {
	return useAwait(async () => {
		const bookmarks = await client.db.bookmarks
			.filter("user.id", userId)
			.select(["*", "tweet.*", "tweet.user.displayName", "tweet.user.name"])
			.sort("createdAt", "desc")
			.getAll();

		return Promise.all(
			bookmarks.map(async (bookmark) => {
				const like = await findLike(userId, bookmark?.tweet?.id!);
				const isLiked = like.failed ? false : isDefined(like.data);
				return { ...bookmark, tweet: { ...bookmark.tweet, isLiked } };
			})
		);
	});
}
