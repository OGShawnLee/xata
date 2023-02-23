import client from "./client";
import { useAwait } from "$lib/hooks";

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
		return client.db.bookmarks
			.filter("user.id", userId)
			.select(["*", "tweet.*", "tweet.user.displayName", "tweet.user.name"])
			.sort("createdAt", "desc")
			.getAll();
	});
}
