import client from "./client";
import { useAwait } from "$lib/hooks";

export function createRetweet(uid: string, tid: string, retweetCount = 0) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweets", record: { user: uid, retweetOf: tid } } },
			{ update: { table: "tweets", id: tid, fields: { retweetCount: retweetCount + 1 } } }
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
				user: {
					id: retweet.user?.id,
					displayName: retweet.user?.displayName,
					name: retweet.user?.name,
					description: retweet.user?.description
				}
			};
		});
	});
}

export function findRetweet(uid: string, tid: string) {
	return useAwait(() => {
		return client.db.tweets.filter({ "user.id": uid, "retweetOf.id": tid }).getFirst();
	});
}
