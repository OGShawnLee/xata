import type { TweetEvent, UnfollowEvent } from "@types";
import type { RequestEvent } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { parse, stringify } from "devalue";

export function handleFunctionValidation<T>(event: RequestEvent, process: (raw: unknown) => T) {
	return useAwait(async () => {
		const text = await event.request.text();
		const raw = parse(text);
		const authorization = event.request.headers.get(INTERNAL_HEADER);
		if (authorization !== INTERNAL_TOKEN) throw Error("Event Denied");
		return process(raw);
	});
}

export function triggerTweetEvent(event: RequestEvent, uid: string, tid: string) {
	event.fetch("/functions/feed", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			[INTERNAL_HEADER]: INTERNAL_TOKEN
		},
		body: stringify({ "tweet.id": tid, "user.id": uid } satisfies TweetEvent)
	});
}

export function triggerUnfollowEvent(event: RequestEvent, unfollower: string, unfollowed: string) {
	event.fetch("/functions/unfollow", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			[INTERNAL_HEADER]: INTERNAL_TOKEN
		},
		body: stringify({
			"unfollowed.id": unfollowed,
			"unfollower.id": unfollower
		} satisfies UnfollowEvent)
	});
}
