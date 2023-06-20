import type { RequestEvent } from "./$types";
import type { ZodError } from "zod";
import { error, fail, redirect } from "@sveltejs/kit";
import { messageSchema } from "$lib/validation/schema";
import { useCatch } from "$lib/hooks";
import { createMessage, findChat, updateChatLastMessage } from "$lib/server/chat";
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
		updateChatLastMessage(chat.data.id, result.data.id);

		return result.data;
	}
}
