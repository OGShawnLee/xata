import type { Chat, Paginated } from "@types";
import type { LayoutServerLoad } from "./$types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { error, redirect } from "@sveltejs/kit";
import { createUserObject } from "$lib/server/utils";

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const inbox = await getInbox(user.data.id);
	if (inbox.failed) throw error(500, { message: "UNABLE TO LOAD INBOX." });
	return { inbox: inbox.data, user: user.data };
};

function getInbox(cuid: string, after?: string) {
	return useAwait<Paginated<Chat>>(async () => {
		const paginated = await client.db.chat
			.filter({
				$any: [{ createdBy: cuid }, { recipient: cuid, draft: false }]
			})
			.select([
				"*",
				"createdBy.displayName",
				"createdBy.name",
				"recipient.displayName",
				"recipient.name"
			])
			.getPaginated({ pagination: { size: 15, after } });
		return {
			page: paginated.meta.page,
			records: paginated.records.map(({ id, createdBy, recipient }) => {
				const isRecipient = cuid === recipient?.id;
				const finalRecipient = createUserObject(isRecipient ? createdBy : recipient, false);
				return { id, recipient: finalRecipient };
			})
		};
	});
}
