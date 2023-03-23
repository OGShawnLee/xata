import type { ZodError } from "zod";
import type { RequestEvent } from "@sveltejs/kit";
import { string } from "zod";
import { error, fail, redirect } from "@sveltejs/kit";
import { useAwait, useCatch } from "$lib/hooks";
import { tweetSchema } from "$lib/validation/schema";
import { createTweet, findTweet } from "$lib/server/tweet";
import { isNullish } from "malachite-ui/predicate";
import { createBookmark, deleteBookmark, findBookmark } from "$lib/server/bookmark";
import { findLike, likeTweet, unlikeTweet } from "$lib/server/like";
import { triggerNotificationEvent } from "$lib/server/notification";
import { isDefined } from "$lib/utils/predicate";
import { createRetweet, findRetweet } from "$lib/server/retweet";
import { quote } from "$lib/server/quote";
import { pin, unpin } from "$lib/server/pin";
import { getHashtags } from "$lib/utils";

export default class Action {
	static async handleBookmark(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		const bookmark = await findBookmark(user.id, id);
		if (bookmark.failed) throw error(500, { message: "Unable to Bookmark Tweet." });

		if (bookmark.data) {
			const deleted = await deleteBookmark(bookmark.data.id, id);
			if (deleted.failed) throw error(500, { message: "Unable to Delete Bookmark." });
		} else {
			const createdBookmark = await createBookmark(user.id, id);
			if (createdBookmark.failed) throw error(500, { message: "Unable to Bookmark Tweet." });
		}

		const location = event.url.searchParams.get("redirect");
		if (location) throw redirect(303, location);
	}

	static async handleLike(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		const like = await findLike(user.id, id);
		if (like.failed) throw error(500, { message: "Unable to like Tweet." });

		if (like.data) {
			const deleted = await unlikeTweet(like.data.id, id);
			if (deleted.failed) throw error(500, { message: "Unable to unlike Tweet." });
		} else {
			const createdLike = await likeTweet(user.id, id);
			if (createdLike.failed) throw error(500, { message: "Unable to like Tweet." });

			if (tweet.user.id && tweet.user.id !== user.id) {
				triggerNotificationEvent(event, {
					type: "LIKE",
					"from.id": user.id,
					"to.id": tweet.user.id,
					"tweet.id": tweet.id
				});
			}
		}

		const location = event.url.searchParams.get("redirect");
		if (location) throw redirect(303, location);
	}

	static async quote(event: RequestEvent) {
		const { user, tweet, data } = await handleActionValidation(event);

		const input = data.get("tweet-text");
		const text = await useAwait<string, ZodError>(() => tweetSchema.parse(input));
		if (text.failed) {
			const errors = text.error.flatten().formErrors;
			return fail(400, {
				text: { value: input as string | null, error: errors[0] }
			});
		}

		const hashtags = getHashtags(text.data);
		const quotedTweet = await quote({ text: text.data, user: user.id, tweet: tweet.id, hashtags });
		if (quotedTweet.failed) return error(500, { message: "Unable to quote Tweet." });
	}

	static async pin(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		if (user.id !== tweet.user.id)
			throw error(403, { message: "Cannot pin a Tweet that does not belong to you." });
		if (tweet.retweetOf) throw error(400, { message: "Cannot pin a retweet." });

		const pinned = await pin(id, user.id);
		if (pinned.failed) throw error(500, { message: "Unable to pin Tweet." });
	}

	static async retweet(event: RequestEvent) {
		const { id, user, tweet } = await handleActionValidation(event);
		const retweet = await findRetweet(user.id, id);
		if (retweet.failed) throw error(500, { message: "Unable to retweet Tweet." });
		if (retweet.data) throw fail(400, { error: "Tweet has been already retweeted." });

		const created = await createRetweet(user.id, id);
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
		const hashtags = getHashtags(text.data);

		const tweet = await createTweet(event.locals.user.data.id, text.data, hashtags);
		if (tweet.failed) {
			return fail(500, {
				error: "Unable to create Tweet.",
				text: { value: text.data }
			});
		}
	}

	static async unpin(event: RequestEvent) {
		const { user } = await handleActionValidation(event);
		const result = await unpin(user.id);
		if (result.failed) throw error(500, { message: "Unable to unpin pin." });
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

	return { id: id.data, user: user.data, tweet: tweet.data, data };
}
