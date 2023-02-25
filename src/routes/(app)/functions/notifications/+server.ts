import type { RequestHandler, RequestEvent } from "@sveltejs/kit";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { parse } from "devalue";
import { useAwait } from "$lib/hooks";
import { notificationSchema } from "$lib/validation/schema";
import { createLikeNotification } from "$lib/server/notification";
import { response } from "$lib/server/utils";

export const POST: RequestHandler = async (event) => {
	const notification = await handleNotificationValidation(event);
	if (notification.failed) return response(400);

	const { type, data } = notification.data;
	if (type === "LIKE") {
		const notification = await createLikeNotification(
			data["from.id"],
			data["to.id"],
			data["tweet.id"]
		);
		if (notification.failed) return response(500);
		return response(200);
	}

	return response(400);
};

function handleNotificationValidation(event: RequestEvent) {
	return useAwait(async () => {
		const text = await event.request.text();
		const raw = parse(text);
		const authorization = event.request.headers.get(INTERNAL_HEADER);
		const notification = notificationSchema.parse(raw);
		if (authorization !== INTERNAL_TOKEN) throw Error("Event Denied");
		return notification;
	});
}
