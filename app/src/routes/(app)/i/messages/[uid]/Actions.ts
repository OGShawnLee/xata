import type { RequestEvent } from "./$types";
import type { ZodError } from "zod";
import client from "$lib/server/client";
import { error, fail, redirect } from "@sveltejs/kit";
import { messageSchema } from "$lib/validation/schema";
import { useAwait, useCatch } from "$lib/hooks";
import { findChat } from "$lib/server/chat";
import { isNullish } from "malachite-ui/predicate";

export default class {
	static async createMessage({ locals, params, request }: RequestEvent) {
		if (locals.user.isAnonymous) throw redirect(303, "/auth/sign-in");

		const data = await request.formData();
		const message = data.get("message");
		const chat = await findChat(locals.user.data.id, params.uid);

		if (chat.failed) throw error(500, { message: "UNABLE TO CHECK CHAT." });
		if (isNullish(chat.data)) throw error(404, { message: "CHAT DOES NOT EXIST." });

		const text = useCatch<string, ZodError>(() => messageSchema.parse(message));
		if (text.failed) {
			const errors = text.error.flatten().formErrors;
			return fail(400, {
				message: { value: message as string | null, error: errors[0] }
			});
		}

		const result = await createMessage(locals.user.data.id, chat.data, text.data);
		if (result.failed) throw error(500, { message: "UNABLE TO CREATE MESSAGE." });
		updateChatLastMessage(chat.data.id, result.data);

		return { id: result.data };
	}
}

function createMessage(cuid: string, chat: { id: string; draft: boolean }, text: string) {
	return useAwait(async () => {
		if (chat.draft) {
			const transaction = await client.transactions.run([
				{ insert: { table: "message", record: { chat: chat.id, user: cuid, text } } },
				{ update: { table: "chat", id: chat.id, fields: { draft: false } } }
			]);
			return transaction.results[0].id;
		}

		const message = await client.db.message.create({ chat: chat.id, user: cuid, text });
		return message.id;
	});
}

function updateChatLastMessage(chat: string, mid: string) {
	return useAwait(async () => {
		return client.db.chat.update(chat, { lastMessage: mid });
	});
}
