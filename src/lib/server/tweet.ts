import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { getTweetState } from "./user";

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
			.select(["*", "user.displayName", "user.name"])
			.getFirst();

		if (isNullish(tweet)) return null;

		return {
			id: tweet.id,
			createdAt: tweet.createdAt,
			text: tweet.text,
			likeCount: tweet.likeCount,
			retweetCount: tweet.retweetCount,
			retweetOf: tweet.retweetOf?.id,
			isBookmarked: false,
			isLiked: false,
			user: {
				id: tweet.user?.id,
				name: tweet.user?.name,
				displayName: tweet.user?.displayName
			}
		};
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

export function getTweets() {
	return useAwait(() => {
		return client.db.tweets
			.select([
				"*",
				"user.displayName",
				"user.name",
				"retweetOf.text",
				"retweetOf.user.displayName",
				"retweetOf.user.name",
				"retweetOf.createdAt"
			])
			.sort("createdAt", "desc")
			.getAll();
	});
}
