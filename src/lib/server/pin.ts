import client from "./client";
import { useAwait } from "$lib/hooks";

export function pin(id: string, uid: string) {
	return useAwait(() => {
		return client.db.users.update(uid, { pinnedTweet: id });
	});
}
