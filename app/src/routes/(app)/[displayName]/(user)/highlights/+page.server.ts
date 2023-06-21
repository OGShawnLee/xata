import type { PageServerLoad } from "./$types";
import type { Paginated, Tweet } from "@types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";
import { createTweetObject } from "$lib/server/utils";
import { getTweetState } from "$lib/server/user";

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	const paginated = await getUserHighlights(
		params.displayName,
		user.isAnonymous ? undefined : user.data.id
	);
	if (paginated.failed) throw error(500, { message: "FAILED TO GET USER HIGHLIGHTS." });
	return { feed: paginated.data };
};

function getUserHighlights(displayName: string, cuid?: string, after?: string) {
	return useAwait<Paginated<Tweet>>(async () => {
		const paginated = await client.db.highlight
			.filter("user.displayName", displayName)
			.select([
				"*",
				"tweet.*",
				"tweet.user.description",
				"tweet.user.displayName",
				"tweet.user.name",
				"tweet.quoteOf.createdAt",
				"tweet.quoteOf.text",
				"tweet.quoteOf.user",
				"tweet.replyOf.user"
			])
			.getPaginated({ pagination: { after } });

		if (cuid) {
			return {
				page: paginated.meta.page,
				records: await Promise.all(
					paginated.records.map(async (highlight) => {
						if (isNullish(highlight.tweet)) throw TypeError("Highlight Tweet is not defined.");

						const tweet = createTweetObject(highlight.tweet);
						const state = await getTweetState(cuid, highlight.tweet.id);
						tweet.isBookmarked = state.isBookmarked;
						tweet.isLiked = state.isLiked;

						return tweet;
					})
				)
			};
		}

		return {
			page: paginated.meta.page,
			records: paginated.records.map((highlight) => {
				if (isNullish(highlight.tweet)) throw TypeError("Highlight Tweet is not defined.");
				return createTweetObject(highlight.tweet);
			})
		};
	});
}
