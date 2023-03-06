import type { UsersRecord } from "$lib/server/xata";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { getTweets } from "./tweet";
import { findBookmark } from "./bookmark";
import { isDefined } from "$lib/utils/predicate";
import { findLike } from "./like";
import { isNullish } from "malachite-ui/predicate";
import { createTweetObject, createTweetObjectWithRetweet } from "./utils";

export function createUser(data: Pick<UsersRecord, "displayName" | "email" | "name" | "password">) {
	return useAwait(async () => {
		const user = await client.db.users.create(data);
		return user.toSerializable();
	});
}

export function findUser(displayName: string) {
	return useAwait(async () => {
		const user = await client.db.users.filter("displayName", displayName).getFirst();
		return user?.toSerializable();
	});
}

export async function findUserPublic(displayName: string) {
	const user = await client.db.users
		.filter("displayName", displayName)
		.select(["createdAt", "displayName", "name", "description", "location"])
		.getFirst();
	if (isNullish(user)) return null;
	return {
		id: user.id,
		displayName: user.displayName,
		name: user.name,
		description: user.description,
		location: user.location,
		createdAt: user.createdAt
	};
}

export function getUserPublicPage(displayName: string, currentUser: string | undefined) {
	return useAwait(async () => {
		return Promise.all([findUserPublic(displayName), getUserTweets(displayName, currentUser)]);
	});
}

export function getUserLikes(displayName: string, cuid: string | undefined) {
	return useAwait(async () => {
		const likes = await client.db.likes
			.filter("user.displayName", displayName)
			.select([
				"*",
				"tweet.*",
				"tweet.user.description",
				"tweet.user.displayName",
				"tweet.user.name"
			])
			.sort("likedAt", "desc")
			.getAll();

		if (isNullish(cuid))
			return likes.map((like) => {
				if (isNullish(like.tweet)) throw TypeError("Like Tweet is not defined.");
				return {
					id: like.id,
					likedAt: like.likedAt,
					tweet: createTweetObject(like.tweet)
				};
			});

		return Promise.all(
			likes.map(async (like) => {
				if (isNullish(like.tweet)) throw TypeError("Like Tweet is not defined.");

				const tweet = createTweetObject(like.tweet);
				const state = await getTweetState(cuid, like.tweet.id);
				tweet.isBookmarked = state.isBookmarked;
				tweet.isLiked = state.isLiked;
				return { id: like.id, likedAt: like.likedAt, tweet };
			})
		);
	});
}

export function getUserFeed(id: string) {
	return useAwait<TweetObject[]>(async () => {
		const tweets = await getTweets();
		if (tweets.failed) throw tweets.error;
		return Promise.all(
			tweets.data.map(async (tweet) => {
				const [bookmark, like] = await Promise.all([
					findBookmark(id, tweet.id),
					findLike(id, tweet.id)
				]);
				tweet.isBookmarked = bookmark.failed ? false : isDefined(bookmark.data);
				tweet.isLiked = like.failed ? false : isDefined(like.data);
				return tweet;
			})
		);
	});
}

export async function getTweetState(uid: string, tid: string) {
	const [bookmark, like] = await Promise.all([findBookmark(uid, tid), findLike(uid, tid)]);
	const isLiked = like.failed ? false : isDefined(like.data);
	const isBookmarked = bookmark.failed ? false : isDefined(bookmark.data);
	return { isLiked, isBookmarked };
}

export async function getUserTweets(
	displayName: string,
	cuid: string | undefined
): Promise<TweetObject[]> {
	const tweets = await client.db.tweets
		.filter("user.displayName", displayName)
		.select([
			"*",
			"user.description",
			"user.displayName",
			"user.name",
			"user.id",
			"retweetOf.text",
			"retweetOf.user.description",
			"retweetOf.user.displayName",
			"retweetOf.user.name",
			"retweetOf.createdAt"
		])
		.sort("createdAt", "desc")
		.getAll();

	if (isNullish(cuid)) return tweets.map(createTweetObject);

	return Promise.all(
		tweets.map(async (tweet) => {
			const finalTweet = createTweetObjectWithRetweet(tweet);
			const [like, bookmark] = await Promise.all([
				findLike(cuid, tweet.id),
				findBookmark(cuid, tweet.id)
			]);
			finalTweet.isBookmarked = bookmark.failed ? false : isDefined(bookmark.data);
			finalTweet.isLiked = like.failed ? false : isDefined(like.data);
			return finalTweet;
		})
	);
}

export function updateUserProfile(
	id: string,
	data: { name: string; description: string; location: string }
) {
	return useAwait(() => {
		return client.db.users.updateOrThrow(id, data);
	});
}
