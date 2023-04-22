import client from "./client";
import { useAwait } from "$lib/hooks";

export function findFollow(uid: string, cuid: string) {
	return useAwait(() => {
		return client.db.follow.filter({ followed: uid, follower: cuid }).getFirst();
	});
}

export function follow(uid: string, cuid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "follow", record: { followed: uid, follower: cuid } } },
			{ update: { table: "users", id: uid, fields: { followerCount: { $increment: 1 } } } },
			{ update: { table: "users", id: cuid, fields: { followingCount: { $increment: 1 } } } }
		]);
	});
}

export function unfollow(uid: string, cuid: string, fid: string) {
	return useAwait(() => {
		return client.transactions.run([
			{ delete: { table: "follow", id: fid } },
			{ update: { table: "users", id: uid, fields: { followerCount: { $decrement: 1 } } } },
			{ update: { table: "users", id: cuid, fields: { followingCount: { $decrement: 1 } } } }
		]);
	});
}
