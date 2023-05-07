import type { Actions, PageServerLoad } from "./$types";
import type { Message, Recipient } from "@types";
import Action from "./Actions";
import client from "$lib/server/client";
import { error, redirect } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { useAwait } from "$lib/hooks";
import { findChat } from "$lib/server/chat";
import { sign } from "jsonwebtoken";
import { CHAT_TOKEN } from "$env/static/private";

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
		const chat = await createChat(user.data.id, params.uid);
		if (chat.failed) throw error(500, { message: "UNABLE TO CRATE CHAT." });
		const token = createChatToken(user.data.id, chat.data.id, chat.data.draft);
		return { messages: [], recipient: recipient.data, token, user: user.data };
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

// no good exposing token to client but at least it is not the auth one
function createChatToken(cuid: string, chat: string, draft: boolean) {
	return sign({ chat, cuid, draft }, CHAT_TOKEN, { expiresIn: "8h" });
}

function findRecipient(uid: string) {
	return useAwait<Recipient | undefined>(async () => {
		const user = await client.db.user
			.filter("id", uid)
			.select(["createdAt", "description", "displayName", "followerCount", "name"])
			.getFirst();

		if (isNullish(user)) return;

		return {
			id: user.id,
			createdAt: user.createdAt,
			description: user.description,
			displayName: user.displayName,
			name: user.name,
			followerCount: user.followerCount
		};
	});
}

function getChatMessages(chat: string) {
	return useAwait<Message[]>(async () => {
		const records = await client.db.message.filter("chat", chat).getAll();
		return records.map((record) => {
			return {
				id: record.id,
				createdAt: record.createdAt,
				user: record.user?.id,
				text: record.text
			};
		});
	});
}
