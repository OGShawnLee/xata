import type { RequestHandler } from "./$types";
import type { MessageSearch, Paginated } from "@types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish, isWhitespace } from "malachite-ui/predicate";
import { stringify } from "devalue";

export const GET: RequestHandler = async ({ locals, url }) => {
	if (locals.user.isAnonymous) return new Response(null, { status: 401 });
	const query = url.searchParams.get("query");
	if (isNullish(query) || isWhitespace(query)) return new Response(null, { status: 400 });
	const messages = await findUserMessages(locals.user.data.id, query);
	if (messages.failed) return new Response(null, { status: 500 });
	return new Response(stringify(messages.data), { status: 200 });
};

function findUserMessages(uid: string, query: string) {
	return useAwait<Paginated<MessageSearch>>(async () => {
		const paginated = await client.db.message
			.filter({
				$any: [{ "chat.recipient.id": uid }, { "chat.createdBy.id": uid }],
				text: { $contains: query }
			})
			.select(["*", "user.name", "chat.recipient.id"])
			.sort("createdAt", "desc")
			.getPaginated({ pagination: { size: 15 } });
		return {
			page: paginated.meta.page,
			records: paginated.records.map((record) => ({
				id: record.id,
				createdAt: record.createdAt,
				user: record.user?.name,
				text: record.text,
				recipient: record.chat?.recipient?.id
			}))
		};
	});
}
