import type { TweetEvent, UnfollowEvent } from "@types";
import client from "./client";
import { useAwait } from "$lib/hooks";
import { createTweetObject } from "./utils";
import { getTweetState } from "./user";
import { isNullish } from "malachite-ui/predicate";

export function createFeedRecord(uid: string) {
	return client.db.feed.create({ user: uid });
}

export function createFeedTweet(feed: string, tid: string) {
	return client.db.feedTweet.create({ feed, tweet: tid });
}

function findFeedRecord(uid: string) {
	return client.db.feed.filter("user.id", uid).getFirst();
}

function getAllUserFollowers(uid: string) {
	return client.db.follow
		.filter("followed", uid)
		.select(["follower.id"])
		.sort("followedAt", "asc")
		.getAll();
}

export function getUserFollowingFeed(uid: string) {
	return useAwait(async () => {
		const feed = await findFeedRecord(uid);

		if (isNullish(feed)) return [];

		const records = await client.db.feedTweet
			.filter("feed.id", feed.id)
			.select([
				"tweet.*",
				"tweet.user.description",
				"tweet.user.displayName",
				"tweet.user.name",
				"tweet.user.id",
				"tweet.quoteOf.createdAt",
				"tweet.quoteOf.text",
				"tweet.quoteOf.user",
				"tweet.retweetOf.text",
				"tweet.retweetOf.user",
				"tweet.retweetOf.createdAt",
				"tweet.retweetOf.quoteOf",
				"tweet.retweetOf.quoteOf.user",
				"tweet.replyOf.user"
			])
			.sort("tweet.createdAt", "desc")
			.getAll();

		return await Promise.all(
			records.map(async (record) => {
				const finalTweet = createTweetObject(record.tweet);
				const state = await getTweetState(uid, finalTweet.id);
				finalTweet.isBookmarked = state.isBookmarked;
				finalTweet.isLiked = state.isLiked;
				return finalTweet;
			})
		);
	});
}

async function getFeedRecordOrCreate(uid: string) {
	const feed = await client.db.feed.filter("user.id", uid).getFirst();
	return feed ? feed : createFeedRecord(uid);
}

export async function deleteUserFromFollowingFeed(event: UnfollowEvent) {
	const feed = await findFeedRecord(event["unfollower.id"]);
	if (isNullish(feed)) return;
	const tweets = await client.db.feedTweet
		.filter({
			"tweet.user.id": event["unfollowed.id"],
			"feed.id": feed.id
		})
		.getAll();
	client.db.feedTweet.delete(tweets.map((tweet) => tweet.id));
}

export async function updateUserFollowersFeed(event: TweetEvent) {
	const follows = await getAllUserFollowers(event["user.id"]);
	follows.forEach(async (follow) => {
		const feed = await useAwait(() => {
			if (follow.follower) return getFeedRecordOrCreate(follow.follower.id);
			throw Error("User not found.");
		});
		if (feed.failed) return;
		createFeedTweet(feed.data.id, event["tweet.id"]);
	});
}
