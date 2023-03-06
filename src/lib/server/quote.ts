import client from "./client";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { createTweetObjectMinimal } from "./utils";
import { getTweetState } from "./user";

export function findTweetQuotes(id: string, cuid: string | undefined) {
	return useAwait<TweetObject[]>(async () => {
		const tweets = await client.db.tweets
			.filter("quoteOf.id", id)
			.select(["*", "user.description", "user.displayName", "user.name", "user.id"])
			.sort("createdAt", "desc")
			.getAll();

		if (isNullish(cuid)) return tweets.map(createTweetObjectMinimal);

		return Promise.all(
			tweets.map(async (tweet) => {
				const finalTweet = createTweetObjectMinimal(tweet);
				const state = await getTweetState(cuid, tweet.id);
				finalTweet.isBookmarked = state.isBookmarked;
				finalTweet.isLiked = state.isLiked;
				return finalTweet;
			})
		);
	});
}

export function quote({
	text,
	tweet,
	user
}: {
	text: string;
	tweet: { id: string; quoteCount: number };
	user: { id: string };
}) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweets", record: { user: user.id, text, quoteOf: tweet.id } } },
			{ update: { table: "tweets", id: tweet.id, fields: { quoteCount: tweet.quoteCount + 1 } } }
		]);
	});
}
