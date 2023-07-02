import type { Chat, Message, Paginated, Recipient } from "@types";
import client from "./client";
import { useAwait } from "$lib/hooks";
import { createUserObject } from "./utils";
import { isNullish } from "malachite-ui/predicate";
import { CHAT_TOKEN } from "$env/static/private";
import { sign } from "jsonwebtoken";

// no good exposing token to client but at least it is not the auth one
export function createChatToken(cuid: string, chat: string, draft: boolean) {
	return sign({ chat, cuid, draft }, CHAT_TOKEN, { expiresIn: "8h" });
}

export function createMessage(cuid: string, chat: { id: string; draft: boolean }, text: string) {
	return useAwait<Message>(async () => {
		if (chat.draft) {
			const transaction = await client.transactions.run([
				{ insert: { table: "message", record: { chat: chat.id, user: cuid, text } } },
				{ update: { table: "chat", id: chat.id, fields: { draft: false } } }
			]);
			return { id: transaction.results[0].id, user: cuid, text, createdAt: new Date() };
		}

		const message = await client.db.message.create({ chat: chat.id, user: cuid, text });
		return { id: message.id, user: cuid, text, createdAt: message.createdAt };
	});
}

export function findChat(cuid: string, rid: string) {
	return useAwait(async () => {
		const chat = await client.db.chat
			.filter({
				participants: { $includesAll: [cuid, rid] }
			})
			.select(["id", "draft"])
			.getFirst();

		if (chat) return { id: chat.id, draft: chat.draft };
	});
}

export function findRecipient(uid: string) {
	return useAwait<(Recipient & { hasPublicMessagingEnabled: boolean }) | undefined>(async () => {
		const user = await client.db.user
			.filter("id", uid)
			.select([
				"createdAt",
				"description",
				"displayName",
				"followerCount",
				"name",
				"hasPublicMessagingEnabled"
			])
			.getFirst();

		if (isNullish(user)) return;

		return {
			id: user.id,
			createdAt: user.createdAt,
			description: user.description,
			displayName: user.displayName,
			name: user.name,
			followerCount: user.followerCount,
			hasPublicMessagingEnabled: user.hasPublicMessagingEnabled
		};
	});
}

export function getChatMessages(chat: string) {
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

export function getInbox(cuid: string, after?: string) {
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

export function updateChatLastMessage(chat: string, mid: string) {
	return useAwait(async () => {
		return client.db.chat.update(chat, { lastMessage: mid });
	});
}
