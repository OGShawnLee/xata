import type { ZodError } from "zod";
import type { RequestHandler } from "./$types";
import { stringify } from "devalue";
import {
	createChatToken,
	createMessage,
	findChat,
	findRecipient,
	getChatMessages,
	updateChatLastMessage
} from "$lib/server/chat";
import { isNullish } from "malachite-ui/predicate";
import { useCatch } from "$lib/hooks";
import { messageSchema } from "$lib/validation/schema";

export const GET: RequestHandler = async ({ locals: { user }, params }) => {
	if (user.isAnonymous) return new Response(null, { status: 400 });

	const [recipient, chat] = await Promise.all([
		findRecipient(params.uid),
		findChat(user.data.id, params.uid)
	]);

	if (recipient.failed) return new Response(null, { status: 500 });
	if (isNullish(recipient.data)) return new Response(null, { status: 404 });

	if (chat.failed) return new Response(null, { status: 500 });
	if (isNullish(chat.data)) return new Response(null, { status: 404 });

	const messages = await getChatMessages(chat.data.id);
	if (messages.failed) return new Response(null, { status: 500 });
	return new Response(
		stringify({
			recipient: recipient.data,
			messages: messages.data,
			token: createChatToken(user.data.id, chat.data.id, chat.data.draft)
		}),
		{ status: 200 }
	);
};

export const POST: RequestHandler = async ({ locals, request, params }) => {
	if (locals.user.isAnonymous) return new Response(null, { status: 403 });

	const data = await request.formData();
	const message = data.get("message");
	const chat = await findChat(locals.user.data.id, params.uid);

	if (chat.failed) return new Response(null, { status: 500 });
	if (isNullish(chat.data)) return new Response(null, { status: 404 });

	const text = useCatch<string, ZodError>(() => messageSchema.parse(message));
	if (text.failed) return new Response(null, { status: 400 });

	const result = await createMessage(locals.user.data.id, chat.data, text.data);
	if (result.failed) return new Response(null, { status: 500 });
	updateChatLastMessage(chat.data.id, result.data.id);

	return new Response(stringify(result.data), { status: 200 });
};
