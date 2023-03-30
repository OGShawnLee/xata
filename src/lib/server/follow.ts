import client from "./client";
import { useAwait } from "$lib/hooks";

export function follow(uid: string, cuid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "follow", record: { followed: uid, follower: cuid } } },
			{ update: { table: "users", id: uid, fields: { followerCount: { $increment: 1 } } } },
			{ update: { table: "users", id: cuid, fields: { followingCount: { $increment: 1 } } } }
		]);
	});
}
