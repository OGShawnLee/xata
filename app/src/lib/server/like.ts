import client from "./client";
import { useAwait } from "$lib/hooks";
import { createUserObject } from "./utils";

export function findLike(userid: string, tweetid: string) {
	return useAwait(() => {
		return client.db.like.filter({ "tweet.id": tweetid, "user.id": userid }).getFirst();
	});
}

export function findUsersWhoLikedTweet(id: string) {
	return useAwait(async () => {
		const likes = await client.db.like
			.filter("tweet.id", id)
			.select(["*", "user.description", "user.displayName", "user.name"])
			.sort("likedAt", "desc")
			.getAll();

		return likes.map(({ id, likedAt, user }) => {
			return { id, likedAt, user: createUserObject(user) };
		});
	});
}

export function likeTweet(userid: string, tweetid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "like", record: { tweet: tweetid, user: userid } } },
			{ update: { table: "tweet", id: tweetid, fields: { likeCount: { $increment: 1 } } } }
		]);
	});
}

export function unlikeTweet(likeid: string, tweetid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ delete: { table: "like", id: likeid } },
			{ update: { table: "tweet", id: tweetid, fields: { likeCount: { $decrement: 1 } } } }
		]);
	});
}
