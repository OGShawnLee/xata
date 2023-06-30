import type { RequestHandler } from "./$types";
import type { Recipient } from "@types";
import client from "$lib/server/client";
import { isNullish, isWhitespace } from "malachite-ui/predicate";
import { useAwait } from "$lib/hooks";
import { stringify } from "devalue";
import { createUserObject } from "$lib/server/utils";

export const GET: RequestHandler = async ({ locals, params: { query } }) => {
	if (locals.user.isAnonymous) return new Response(null, { status: 401 });
	if (isNullish(query) || isWhitespace(query)) return new Response(null, { status: 400 });

	const batch = await findRecipients(query);
	if (batch.failed) return new Response(null, { status: 500 });
	return new Response(stringify(batch.data), { status: 200 });
};

function findRecipients(query: string) {
	return useAwait<Recipient[]>(async () => {
		const records = await client.db.user.search(query, {
			target: ["displayName", "name"],
			prefix: "phrase"
		});
		return records.map((record) => createUserObject(record, false));
	});
}
