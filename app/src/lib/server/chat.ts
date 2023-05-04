import { useAwait } from "$lib/hooks";
import client from "./client";

export function findChat(cuid: string, rid: string) {
	return useAwait(async () => {
		const chat = await client.db.chat
			.filter({
				participants: { $includesAll: [cuid, rid] }
			})
			.select(["id", "draft"])
			.getFirst();

		if (chat) return { id: chat.id, draft: chat.draft }
	});
}
