import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { getTweetState } from "./user";
import { createTweetObject, createTweetObjectNoRetweet } from "./utils";

export function createTweet(id: string, text: string) {
	return useAwait(async () => {
		const tweet = await client.db.tweets.create({ text, user: { id } });
		return tweet.toSerializable();
	});
}

export function findTweet(id: string, displayName?: string) {
	return useAwait<TweetObject | null>(async () => {
		const tweet = await client.db.tweets
			.filter(displayName ? { id: id, "user.displayName": displayName } : { id: id })
			.select([
				"*",
				"user.description",
				"user.displayName",
				"user.name",
				"quoteOf.createdAt",
				"quoteOf.text",
				"quoteOf.user.description",
				"quoteOf.user.displayName",
				"quoteOf.user.name"
			])
			.getFirst();

		return isNullish(tweet) ? null : createTweetObjectNoRetweet(tweet);
	});
}

export function findUserTweetWithStatus({
	id,
	displayName,
	cuid
}: {
	id: string;
	displayName: string;
	cuid: string | undefined;
}) {
	if (isNullish(cuid)) return findTweet(id, displayName);
	return useAwait(async () => {
		const [tweet, status] = await Promise.all([
			findTweet(id, displayName),
			getTweetState(cuid, id)
		]);

		if (tweet.failed) throw tweet.error;
		if (isNullish(tweet.data)) return null;

		tweet.data.isBookmarked = status.isBookmarked;
		tweet.data.isLiked = status.isLiked;
		return tweet.data;
	});
}

export function getTweets(after?: string) {
	return useAwait<Paginated<TweetObject>>(async () => {
		const paginated = await client.db.tweets
			.select([
				"*",
				"user.description",
				"user.displayName",
				"user.name",
				"user.id",
				"quoteOf.createdAt",
				"quoteOf.text",
				"quoteOf.user.description",
				"quoteOf.user.displayName",
				"quoteOf.user.name",
				"retweetOf.text",
				"retweetOf.user.description",
				"retweetOf.user.displayName",
				"retweetOf.user.name",
				"retweetOf.createdAt",
				"retweetOf.quoteOf.*",
				"retweetOf.quoteOf.user"
			])
			.sort("createdAt", "desc")
			.getPaginated({
				pagination: { after, size: 15 }
			});

		return { page: paginated.meta.page, records: paginated.records.map(createTweetObject) };
	});
}

export async function getTweetReplies(id: string, cuid: string | undefined) {
	const replies = await client.db.tweets
		.filter("replyOf", id)
		.select([
			"*",
			"user.description",
			"user.displayName",
			"user.name",
			"user.id",
			"quoteOf.createdAt",
			"quoteOf.text",
			"quoteOf.user.description",
			"quoteOf.user.displayName",
			"quoteOf.user.name",
			"retweetOf.text",
			"retweetOf.user.description",
			"retweetOf.user.displayName",
			"retweetOf.user.name",
			"retweetOf.createdAt",
			"retweetOf.quoteOf.*",
			"retweetOf.quoteOf.user"
		])
		.sort("createdAt", "desc")
		.getAll();

	if (cuid) {
		return Promise.all(
			replies.map(async (tweet) => {
				const finalTweet = createTweetObject(tweet);
				const state = await getTweetState(cuid, tweet.id);
				finalTweet.isBookmarked = state.isBookmarked;
				finalTweet.isLiked = state.isLiked;
				return finalTweet;
			})
		);
	}

	return replies.map(createTweetObject);
}

export function reply(event: { id: string; cuid: string; text: string; replyCount: number }) {
	const { id, cuid, text, replyCount } = event;
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweets", record: { text, user: cuid, replyOf: id } } },
			{ update: { table: "tweets", id, fields: { replyCount: replyCount + 1 } } }
		]);
	});
}
