import type { RequestEvent } from "./$types";
import type { ZodError } from "zod";
import { findTweet, reply } from "$lib/server/tweet";
import { error, fail } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { useCatch } from "$lib/hooks";
import { tweetSchema } from "$lib/validation/schema";
import { triggerNotificationEvent } from "$lib/server/notification";

export default class Action {
	static async reply(event: RequestEvent) {
		if (event.locals.user.isAnonymous) throw error(400, { message: "User not logged in." });

		const data = await event.request.formData();
		const rawText = data.get("tweet-text");

		const text = useCatch<string, ZodError>(() => tweetSchema.parse(rawText));
		if (text.failed) {
			const errors = text.error.flatten().formErrors;
			return fail(400, {
				text: { value: rawText?.toString(), error: errors[0] }
			});
		}

		const tweet = await findTweet(event.params.id);
		if (tweet.failed) throw error(500, { message: "Unable to find Tweet." });
		if (isNullish(tweet.data)) throw error(404, { message: "Tweet not found." });

		const result = await reply({
			id: tweet.data.id,
			cuid: event.locals.user.data.id,
			text: text.data,
			replyCount: tweet.data.replyCount
		});
		if (result.failed) throw error(500, { message: "Unable to reply." });

		if (tweet.data.user.id && event.locals.user.data.id !== tweet.data.user.id)
			triggerNotificationEvent(event, {
				type: "REPLY",
				"from.id": event.locals.user.data.id,
				"to.id": tweet.data.user.id,
				"tweet.id": tweet.data.id,
				"reply.id": result.data.results[0].id
			});
	}
}
