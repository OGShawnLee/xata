import client from "./client";
import { useAwait } from "$lib/hooks";

export function findLike(userId: string, tweetId: string) {
	return useAwait(() => {
		return client.db.likes.filter({ "tweet.id": tweetId, "user.id": userId }).getFirst();
	});
}

export function likeTweet(userId: string, tweetId: string, likeCount: number) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "likes", record: { tweet: tweetId, user: userId } } },
			{ update: { table: "tweets", id: tweetId, fields: { likeCount: likeCount + 1 } } }
		]);
	});
}

export function unlikeTweet(id: string, tweetId: string, likeCount: number) {
	return useAwait(() => {
		return client.transactions.run([
			{ delete: { table: "likes", id } },
			{ update: { table: "tweets", id: tweetId, fields: { likeCount: likeCount - 1 } } }
		]);
	});
}
