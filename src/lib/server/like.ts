import client from "./client";
import { useAwait } from "$lib/hooks";

export function findLike(userid: string, tweetid: string) {
	return useAwait(() => {
		return client.db.likes.filter({ "tweet.id": tweetid, "user.id": userid }).getFirst();
	});
}

export function findUsersWhoLikedTweet(id: string) {
	return useAwait(async () => {
		const likes = await client.db.likes
			.filter("tweet.id", id)
			.select(["*", "user.description", "user.displayName", "user.name"])
			.sort("likedAt", "desc")
			.getAll();

		return likes.map((like) => {
			return {
				id: like.id,
				likedAt: like.likedAt,
				user: {
					id: like.user?.id,
					description: like.user?.description,
					displayName: like.user?.displayName,
					name: like.user?.name
				}
			};
		});
	});
}

export function likeTweet(userid: string, tweetid: string, likeCount: number) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "likes", record: { tweet: tweetid, user: userid } } },
			{ update: { table: "tweets", id: tweetid, fields: { likeCount: likeCount + 1 } } }
		]);
	});
}

export function unlikeTweet(likeid: string, tweetid: string, likeCount: number) {
	return useAwait(() => {
		return client.transactions.run([
			{ delete: { table: "likes", id: likeid } },
			{ update: { table: "tweets", id: tweetid, fields: { likeCount: likeCount - 1 } } }
		]);
	});
}
