import type { NotificationEvent } from "@types";
import type { RequestEvent } from "@sveltejs/kit";
import client from "./client";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { useAwait } from "$lib/hooks";
import { stringify } from "devalue";
import { isNullish } from "malachite-ui/predicate";
import { createNotificationObject, createTweetObject } from "./utils";
import { getTweetState } from "./user";

export function createNotification(event: NotificationEvent) {
	return useAwait(() =>
		client.db.notifications.create({
			type: event.type,
			from: event["from.id"],
			to: event["to.id"],
			tweet: event["tweet.id"],
			reply: event["reply.id"]
		})
	);
}

export function getNotifications(id: string) {
	return useAwait(async () => {
		const notifications = await client.db.notifications
			.filter("to", id)
			.select([
				"*",
				"from.displayName",
				"from.name",
				"tweet.text",
				"reply.*",
				"reply.user.description",
				"reply.user.displayName",
				"reply.user.name",
				"reply.replyOf.user"
			])
			.sort("createdAt", "desc")
			.getAll();

		return Promise.all(
			notifications.map(async (notification) => {
				if (isNullish(notification.reply)) return createNotificationObject(notification);

				const finalTweet = createTweetObject(notification.reply);
				const state = await getTweetState(id, notification.reply.id);
				finalTweet.isBookmarked = state.isBookmarked;
				finalTweet.isLiked = state.isLiked;

				return createNotificationObject(notification, finalTweet);
			})
		);
	});
}

export function triggerNotificationEvent(event: RequestEvent, notification: NotificationEvent) {
	if (notification.type === "REPLY" && isNullish(notification["reply.id"]))
		throw TypeError("Reply id not provided for notification reply event.");

	event.fetch("/functions/notifications", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			[INTERNAL_HEADER]: INTERNAL_TOKEN
		},
		body: stringify(notification)
	});
}
