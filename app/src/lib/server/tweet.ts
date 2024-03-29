import type { Hashtags, Paginated, Tweet, TweetEvent } from "@types";
import type { RequestEvent } from "@sveltejs/kit";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish, isObject } from "malachite-ui/predicate";
import { getTweetState } from "./user";
import { createTweetObject } from "./utils";
import { getHashtags } from "$lib/utils";
import { includes } from "@xata.io/client";
import { INTERNAL_HEADER, INTERNAL_TOKEN } from "$env/static/private";
import { stringify } from "devalue";

export function createTweet(id: string, text: string) {
	return useAwait(async () => {
		const operation = await client.transactions.run([
			{
				insert: {
					table: "tweet",
					record: { text, user: id, entities: { hashtags: getHashtags(text) } }
				}
			},
			{ update: { table: "user", id, fields: { tweetCount: { $increment: 1 } } } }
		]);
		return operation.results[0].id;
	});
}

export function findTweet(id: string, displayName?: string) {
	return useAwait<Tweet | null>(async () => {
		const tweet = await client.db.tweet
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
				"quoteOf.user.name",
				"retweetOf.text",
				"retweetOf.user.description",
				"retweetOf.user.displayName",
				"retweetOf.user.name",
				"retweetOf.createdAt",
				"retweetOf.quoteOf.*",
				"retweetOf.quoteOf.user",
				"replyOf.*",
				"replyOf.user.description",
				"replyOf.user.displayName",
				"replyOf.user.name",
				"replyOf.replyOf.*",
				"replyOf.replyOf.user"
			])
			.getFirst();

		return isNullish(tweet) ? null : createTweetObject(tweet);
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

		if (cuid) {
			let currentTweet = tweet.data.replyOf;
			while (currentTweet) {
				if (isObject(currentTweet, ["text"])) {
					const status = await getTweetState(cuid, currentTweet.id);
					currentTweet.isBookmarked = status.isBookmarked;
					currentTweet.isLiked = status.isLiked;
					currentTweet = currentTweet.replyOf;
				} else break;
			}
		}

		tweet.data.isBookmarked = status.isBookmarked;
		tweet.data.isLiked = status.isLiked;
		return tweet.data;
	});
}

export function getTweets(after?: string) {
	return useAwait<Paginated<Tweet>>(async () => {
		const paginated = await client.db.tweet
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
				"retweetOf.quoteOf.user",
				"replyOf.user.description",
				"replyOf.user.displayName",
				"replyOf.user.name"
			])
			.sort("createdAt", "desc")
			.getPaginated({
				pagination: { after, size: 15 }
			});

		return { page: paginated.meta.page, records: paginated.records.map(createTweetObject) };
	});
}

export async function getTweetReplies(id: string, cuid: string | undefined) {
	const replies = await client.db.tweet
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
			"retweetOf.quoteOf.user",
			"replyOf.user"
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

export function getTweetsByHashtag(hashtag: string, cuid?: string) {
	return useAwait<Paginated<Tweet>>(async () => {
		const paginated = await client.db.tweet
			.filter("entities.hashtags", includes("#" + hashtag.toLowerCase()))
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
				"retweetOf.quoteOf.user",
				"replyOf.user.description",
				"replyOf.user.displayName",
				"replyOf.user.name"
			])
			.sort("createdAt", "desc")
			.getPaginated({ pagination: { size: 15 } });

		if (isNullish(cuid))
			return { page: paginated.meta.page, records: paginated.records.map(createTweetObject) };

		return {
			page: paginated.meta.page,
			records: await Promise.all(
				paginated.records.map(async (tweet) => {
					const finalTweet = createTweetObject(tweet);
					const state = await getTweetState(cuid, tweet.id);
					finalTweet.isBookmarked = state.isBookmarked;
					finalTweet.isLiked = state.isLiked;
					return finalTweet;
				})
			)
		};
	});
}

export function reply(event: { id: string; cuid: string; hashtags: Hashtags; text: string }) {
	const { id, cuid, text, hashtags } = event;
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweet", record: { text, user: cuid, replyOf: id, hashtags } } },
			{ update: { table: "tweet", id, fields: { replyCount: { $increment: 1 } } } },
			{ update: { table: "user", id: cuid, fields: { tweetCount: { $increment: 1 } } } }
		]);
	});
}
