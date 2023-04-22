import type { Paginated, Tweet } from "@types";
import client from "./client";
import { useAwait } from "$lib/hooks";
import { findLike } from "./like";
import { isDefined } from "$lib/utils/predicate";
import { isNullish } from "malachite-ui/predicate";
import { createTweetObject } from "./utils";

export function createBookmark(uid: string, tid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "bookmarks", record: { tweet: tid, user: uid } } },
			{ update: { table: "tweets", id: tid, fields: { bookmarkCount: { $increment: 1 } } } }
		]);
	});
}

export function createBookmarkFolder(uid: string, description: string | undefined, name: string) {
	return useAwait(() => client.db.folder.create({ user: uid, description, name }));
}

export function deleteBookmark(id: string, tid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ delete: { table: "bookmarks", id } },
			{ update: { table: "tweets", id: tid, fields: { bookmarkCount: { $decrement: 1 } } } }
		]);
	});
}

export function findBookmark(uid: string, tid: string) {
	return useAwait(async () => {
		const bookmark = await client.db.bookmarks
			.filter({ "tweet.id": tid, "user.id": uid })
			.getFirst();

		if (isNullish(bookmark)) return;
		return bookmark.toSerializable();
	});
}

export function getBookmarks(cuid: string, after?: string) {
	return useAwait<Paginated<Tweet>>(async () => {
		const paginated = await client.db.bookmarks
			.filter("user.id", cuid)
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
			.getPaginated({ pagination: { after, size: 15 } });

		return {
			page: paginated.meta.page,
			records: await Promise.all(
				paginated.records.map(async (bookmark) => {
					if (isNullish(bookmark.tweet)) throw TypeError("Bookmark Tweet is not defined.");

					const tweet = createTweetObject(bookmark.tweet);
					const like = await findLike(cuid, bookmark.tweet.id);
					tweet.isBookmarked = true;
					tweet.isLiked = like.failed ? false : isDefined(like.data);
					return tweet;
				})
			)
		};
	});
}
