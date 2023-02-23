import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";

export function createTweet(id: string, text: string) {
	return useAwait(async () => {
		const tweet = await client.db.tweets.create({ text, user: { id } });
		return tweet.toSerializable();
	});
}

export function findTweet(id: string) {
	return useAwait(async () => {
		const tweet = await client.db.tweets.filter("id", id).getFirst();
		return tweet?.toSerializable();
	});
}

export function getTweets() {
	return useAwait(async () => {
		return client.db.tweets
			.select(["*", "user.displayName", "user.name"])
			.sort("createdAt", "desc")
			.getAll();
	});
}
