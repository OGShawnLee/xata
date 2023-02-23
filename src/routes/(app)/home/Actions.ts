import type { ZodError } from "zod";
import type { RequestEvent } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";
import { tweetSchema } from "$lib/validation/schema";
import { createTweet } from "$lib/server/tweet";

export default class Action {
	static async tweet(event: RequestEvent) {
		if (event.locals.user.isAnonymous) throw redirect(303, "/auth/sign-up");

		const data = await event.request.formData();
		const input = data.get("tweet-text");

		const text = await useAwait<string, ZodError>(() => tweetSchema.parse(input));
		if (text.failed) {
			const errors = text.error.flatten().formErrors;
			return fail(400, {
				text: { value: input as string | null, error: errors[0] }
			});
		}

		const tweet = await createTweet(event.locals.user.data.id, text.data);
		if (tweet.failed) {
			return fail(500, {
				error: "Unable to create Tweet.",
				text: { value: text.data }
			});
		}
	}
}
