import client from "./client";
import { useAwait } from "$lib/hooks";
import { createUserObject } from "./utils";

export function createRetweet(uid: string, tid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweets", record: { user: uid, retweetOf: tid } } },
			{ update: { table: "tweets", id: tid, fields: { retweetCount: { $increment: 1 } } } }
		]);
	});
}

export function findUsersWhoRetweetedTweet(id: string) {
	return useAwait(async () => {
		const retweets = await client.db.tweets
			.filter("retweetOf", id)
			.select(["createdAt", "user.description", "user.displayName", "user.name"])
			.sort("createdAt", "desc")
			.getAll();

		return retweets.map((retweet) => {
			return {
				id: retweet.id,
				retweetedAt: retweet.createdAt,
				user: createUserObject(retweet.user)
			};
		});
	});
}

export function findRetweet(uid: string, tid: string) {
	return useAwait(() => {
		return client.db.tweets.filter({ "user.id": uid, "retweetOf.id": tid }).getFirst();
	});
}
