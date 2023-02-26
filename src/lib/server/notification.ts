import type { RequestEvent } from "@sveltejs/kit";
import client from "./client";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { useAwait } from "$lib/hooks";
import { stringify } from "devalue";

export function createLikeNotification(from: string, to: string, tweet: string) {
	return useAwait(() => client.db.notifications.create({ from, to, tweet }));
}

export function getNotifications(id: string) {
	return useAwait(() => {
		return client.db.notifications
			.filter("to", id)
			.select(["createdAt", "from.displayName", "from.name", "tweet.text"])
			.sort("createdAt", "desc")
			.getAll();
	});
}

export function triggerNotificationEvent(event: RequestEvent, notification: NotificationEvent) {
	event.fetch("/functions/notifications", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			[INTERNAL_HEADER]: INTERNAL_TOKEN
		},
		body: stringify(notification)
	});
}
