import type { ZodError } from "zod";
import type { RequestEvent } from "@sveltejs/kit";
import { string } from "zod";
import { error, fail, redirect } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";
import { tweetSchema } from "$lib/validation/schema";
import { createTweet, findTweet } from "$lib/server/tweet";
import { isNullish } from "malachite-ui/predicate";
import { createBookmark, deleteBookmark, findBookmark } from "$lib/server/bookmark";
import { findLike, likeTweet, unlikeTweet } from "$lib/server/like";
import { triggerNotificationEvent } from "$lib/server/notification";
import { isDefined } from "$lib/utils/predicate";
import { createRetweet, findRetweet } from "$lib/server/retweet";

export default class Action {
	static async handleBookmark(event: RequestEvent) {
		const { id, user } = await handleActionValidation(event);
		const bookmark = await findBookmark(user.id, id);
		if (bookmark.failed) throw error(500, { message: "Unable to Bookmark Tweet." });

		if (bookmark.data) {
			const deleted = await deleteBookmark(bookmark.data.id);
			if (deleted.failed) throw error(500, { message: "Unable to Delete Bookmark." });
		} else {
			const createdBookmark = await createBookmark(user.id, id);
			if (createdBookmark.failed) throw error(500, { message: "Unable to Bookmark Tweet." });
		}

		const location = event.url.searchParams.get("redirect");
		if (location) throw redirect(303, location);
	}

	static async likeTweet(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		const like = await likeTweet(user.id, id, tweet.likeCount ?? 0);
		if (like.failed) throw error(500, { message: "Unable to like Tweet." });

		if (isDefined(tweet.user.id) && tweet.user.id !== user.id)
			triggerNotificationEvent(event, {
				type: "LIKE",
				"from.id": user.id,
				"to.id": tweet.user.id,
				"tweet.id": tweet.id
			});

		const location = event.url.searchParams.get("redirect");
		if (location) throw redirect(303, location);
	}

	static async retweet(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		const retweet = await findRetweet(user.id, id);
		if (retweet.failed) throw error(500, { message: "Unable to retweet Tweet." });
		if (retweet.data) throw fail(400, { error: "Tweet has been already retweeted." });

		const created = await createRetweet(user.id, id, tweet.retweetCount);
		if (created.failed) throw error(500, { message: "Unable to retweet Tweet." });

		if (isDefined(tweet.user.id) && tweet.user.id !== user.id)
			triggerNotificationEvent(event, {
				type: "RETWEET",
				"from.id": user.id,
				"to.id": tweet.user.id,
				"tweet.id": id
			});

		const location = event.url.searchParams.get("redirect");
		if (location) throw redirect(303, location);
	}

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

	static async unlikeTweet(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		const like = await findLike(user.id, id);
		if (like.failed) throw error(500, { message: "Unable to unlike Tweet." });
		if (isNullish(like.data)) throw fail(400, { error: "Can't unlike a Tweet that is not liked." });

		const deleted = await unlikeTweet(like.data.id, tweet.id, tweet.likeCount ?? 1);
		if (deleted.failed) throw error(500, { message: "Unable to unlike Tweet." });
	}
}

async function handleActionValidation({ locals: { user }, request }: RequestEvent) {
	if (user.isAnonymous) throw error(400, { message: "User not logged in." });

	const data = await request.formData();
	const input = data.get("tweet-id");

	const id = await useAwait(() => string().trim().parse(input));
	if (id.failed) throw error(400, { message: "Invalid Tweet ID." });

	const tweet = await findTweet(id.data);
	if (tweet.failed) throw error(500, { message: "Unable to Validate Tweet." });
	if (isNullish(tweet.data)) throw error(400, { message: "Tweet does not exist." });

	return { id: id.data, user: user.data, tweet: tweet.data };
}
