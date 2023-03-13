import client from "./client";
import { useAwait } from "$lib/hooks";
import { findLike } from "./like";
import { isDefined } from "$lib/utils/predicate";
import { isNullish } from "malachite-ui/predicate";
import { createTweetObject } from "./utils";

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

export function getBookmarks(uid: string) {
	return useAwait(async () => {
		const bookmarks = await client.db.bookmarks
			.filter("user.id", uid)
			.select([
				"*",
				"tweet.*",
				"tweet.user.description",
				"tweet.user.displayName",
				"tweet.user.name",
				"tweet.quoteOf.createdAt",
				"tweet.quoteOf.text",
				"tweet.quoteOf.user",
				"tweet.replyOf.user"
			])
			.sort("createdAt", "desc")
			.getAll();

		return Promise.all(
			bookmarks.map(async (bookmark) => {
				if (isNullish(bookmark.tweet)) throw TypeError("Bookmark Tweet is not defined.");

				const tweet = createTweetObject(bookmark.tweet);
				const like = await findLike(uid, bookmark.tweet.id);
				tweet.isBookmarked = true;
				tweet.isLiked = like.failed ? false : isDefined(like.data);
				return { id: bookmark.id, createdAt: bookmark.createdAt, tweet };
			})
		);
	});
}
