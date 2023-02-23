import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";

export function createTweet(id: string, text: string) {
	return useAwait(async () => {
		const tweet = await client.db.tweets.create({ text, user: { id } });
		return tweet.toSerializable();
	});
}
