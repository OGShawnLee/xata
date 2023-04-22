import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { parse } from "devalue";
import { useAwait } from "$lib/hooks";
import { notificationSchema } from "$lib/validation/schema";
import { createNotification } from "$lib/server/notification";
import { response } from "$lib/server/utils";

export const POST: RequestHandler = async (event) => {
	const notification = await handleNotificationValidation(event);
	if (notification.failed) return response(400);

	const result = await createNotification(notification.data);
	if (result.failed) return response(400);

	return response(200);
};

function handleNotificationValidation(event: RequestEvent) {
	return useAwait(async () => {
		const text = await event.request.text();
		const raw = parse(text);
		const authorization = event.request.headers.get(INTERNAL_HEADER);
		if (authorization !== INTERNAL_TOKEN) throw Error("Event Denied");
		return notificationSchema.parse(raw);
	});
}
