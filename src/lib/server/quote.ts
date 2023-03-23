import type { Hashtags, Tweet } from "@types";
import client from "./client";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { createTweetObject } from "./utils";
import { getTweetState } from "./user";

export function findTweetQuotes(id: string, cuid: string | undefined) {
	return useAwait<Tweet[]>(async () => {
		const tweets = await client.db.tweets
			.filter("quoteOf.id", id)
			.select(["*", "user.description", "user.displayName", "user.name", "user.id"])
			.sort("createdAt", "desc")
			.getAll();

		if (isNullish(cuid)) return tweets.map(createTweetObject);

		return Promise.all(
			tweets.map(async (tweet) => {
				const finalTweet = createTweetObject(tweet);
				const state = await getTweetState(cuid, tweet.id);
				finalTweet.isBookmarked = state.isBookmarked;
				finalTweet.isLiked = state.isLiked;
				return finalTweet;
			})
		);
	});
}

export function quote(event: { hashtags: Hashtags; text: string; tweet: string; user: string }) {
	const { hashtags, text, tweet, user } = event;
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweets", record: { user, text, quoteOf: tweet, hashtags } } },
			{ update: { table: "tweets", id: tweet, fields: { quoteCount: { $increment: 1 } } } }
		]);
	});
}
