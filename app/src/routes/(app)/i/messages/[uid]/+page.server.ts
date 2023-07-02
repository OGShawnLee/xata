import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import client from "$lib/server/client";
import { error, redirect } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { useAwait } from "$lib/hooks";
import { createChatToken, findChat, findRecipient, getChatMessages } from "$lib/server/chat";

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");

	const recipient = await findRecipient(params.uid);
	if (recipient.failed) throw error(500, { message: "UNABLE TO FIND RECIPIENT USER." });
	if (isNullish(recipient.data)) throw error(404, { message: "RECIPIENT NOT FOUND." });

	const chat = await findChat(user.data.id, params.uid);
	if (chat.failed) throw error(500, { message: "UNABLE TO FIND CHAT." });
	if (chat.data) {
		const messages = await getChatMessages(chat.data.id);
		if (messages.failed) throw error(500, { message: "UNABLE TO LOAD CHAT MESSAGES." });
		const token = createChatToken(user.data.id, chat.data.id, chat.data.draft);
		return { messages: messages.data, recipient: recipient.data, token, user: user.data };
	} else {
		if (recipient.data.hasPublicMessagingEnabled) {
			const chat = await createChat(user.data.id, params.uid);
			if (chat.failed) throw error(500, { message: "UNABLE TO CRATE CHAT." });
			const token = createChatToken(user.data.id, chat.data.id, chat.data.draft);
			return { messages: [], recipient: recipient.data, token, user: user.data };
		} else {
			// if recipient does not follow the request user then we throw
			const isFollowed = await isFollowedBy(user.data.id, params.uid);
			if (isFollowed.failed) throw error(500, { message: "Unable to create chat." });
			if (!isFollowed.data)
				throw error(403, {
					message: "Recipient does not allow message requests from users they don't follow."
				});

			const chat = await createChat(user.data.id, params.uid);
			if (chat.failed) throw error(500, { message: "UNABLE TO CRATE CHAT." });
			const token = createChatToken(user.data.id, chat.data.id, chat.data.draft);
			return { messages: [], recipient: recipient.data, token, user: user.data };
		}
	}
};

export const actions: Actions = {
	default: Action.createMessage
};

function createChat(cuid: string, rid: string) {
	return useAwait(async () => {
		const chat = await client.db.chat.create({
			createdBy: cuid,
			participants: [cuid, rid],
			recipient: rid
		});
		return { id: chat.id, draft: chat.draft };
	});
}

function isFollowedBy(uid: string, cuid: string) {
	return useAwait(async () => {
		const follow = await client.db.follow.filter({ followed: uid, follower: cuid }).getFirst();
		return Boolean(follow);
	});
}
