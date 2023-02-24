import client from "./client";
import { useAwait } from "$lib/hooks";

export function likeTweet(userId: string, tweetId: string, likeCount: number) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "likes", record: { tweet: tweetId, user: userId } } },
			{ update: { table: "tweets", id: tweetId, fields: { likeCount: likeCount + 1 } } }
		]);
	});
}
