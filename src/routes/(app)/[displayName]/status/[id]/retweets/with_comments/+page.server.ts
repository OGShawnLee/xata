import type { PageServerLoad } from "./$types";
import { findTweetQuotes } from "$lib/server/quote";
import { error } from "@sveltejs/kit";
import { findTweet, findUserTweetWithStatus } from "$lib/server/tweet";
import { isNullish } from "malachite-ui/predicate";

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	const [tweet, quotes] = await Promise.all([
		findTweet(params.id, params.displayName),
		findTweetQuotes(params.id, user.isSignedIn ? user.data.id : undefined)
	]);

	if (tweet.failed) throw error(500, { message: "Unable to load Tweet Quotes." });
	if (isNullish(tweet.data)) throw error(404, { message: "Tweet not found." });
	if (quotes.failed) throw error(500, { message: "Unable to load Tweet Quotes." });

	return { quotes: quotes.data, tweet: tweet.data };
};
