import client from "./client";
import { useAwait } from "$lib/hooks";

export function findLike(userId: string, tweetId: string) {
	return useAwait(() => {
		return client.db.likes.filter({ "tweet.id": tweetId, "user.id": userId }).getFirst();
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
