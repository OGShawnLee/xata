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

export function findRetweet(uid: string, tid: string) {
	return useAwait(() => {
		return client.db.tweets.filter({ "user.id": uid, "retweetOf.id": tid }).getFirst();
	});
}
