import client from "./client";
import { useAwait } from "$lib/hooks";

export function pin(id: string, uid: string) {
	return useAwait(() => {
		return client.db.user.update(uid, { pinnedTweet: id });
	});
}

export function unpin(uid: string) {
	return useAwait(() => {
		return client.db.user.update(uid, { pinnedTweet: null });
	});
}
