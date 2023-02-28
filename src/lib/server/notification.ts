import type { RequestEvent } from "@sveltejs/kit";
import client from "./client";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { useAwait } from "$lib/hooks";
import { stringify } from "devalue";

export function createNotification(event: NotificationEvent) {
	return useAwait(() =>
		client.db.notifications.create({
			type: event.type,
			from: event["from.id"],
			to: event["to.id"],
			tweet: event["tweet.id"]
		})
	);
}

export function getNotifications(id: string) {
	return useAwait(() => {
		return client.db.notifications
			.filter("to", id)
			.select(["*", "from.displayName", "from.name", "tweet.text"])
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
