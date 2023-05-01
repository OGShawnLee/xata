import client from "./client";
import { useAwait } from "$lib/hooks";
import { createUserObject } from "./utils";

export function createRetweet(uid: string, tid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweet", record: { user: uid, retweetOf: tid } } },
			{ update: { table: "tweet", id: tid, fields: { retweetCount: { $increment: 1 } } } },
			{ update: { table: "user", id: uid, fields: { tweetCount: { $increment: 1 } } } }
		]);
	});
}

export function findUsersWhoRetweetedTweet(id: string) {
	return useAwait(async () => {
		const retweets = await client.db.tweet
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
		return client.db.tweet.filter({ "user.id": uid, "retweetOf.id": tid }).getFirst();
	});
}
