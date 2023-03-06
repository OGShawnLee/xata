import type { SelectedPick } from "@xata.io/client";
import type { TweetsRecord } from "./xata";
import { useAwait } from "$lib/hooks";
import { genSalt, hash } from "bcrypt";

type RawTweetRecord =
	| SelectedPick<
			TweetsRecord,
			(
				| "*"
				| "user.displayName"
				| "user.id"
				| "user.name"
				| "user.description"
				| "retweetOf.createdAt"
				| "retweetOf.text"
				| "retweetOf.user.displayName"
				| "retweetOf.user.name"
			)[]
	  >
	| SelectedPick<TweetsRecord, ("*" | "user.displayName" | "user.name" | "user.description")[]>;

export function createPasswordHash(password: string) {
	return useAwait(async () => {
		return hash(password, await genSalt());
	});
}

export function createTweetObjectWithRetweet(
	tweet: SelectedPick<
		TweetsRecord,
		(
			| "*"
			| "user.displayName"
			| "user.name"
			| "user.description"
			| "retweetOf.createdAt"
			| "retweetOf.text"
			| "retweetOf.user.displayName"
			| "retweetOf.user.name"
			| "retweetOf.user.description"
		)[]
	>
) {
	return {
		id: tweet.id,
		createdAt: tweet.createdAt,
		text: tweet.text,
		likeCount: tweet.likeCount,
		quoteOf: tweet.quoteOf?.id,
		quoteCount: tweet.quoteCount,
		retweetCount: tweet.retweetCount,
		retweetOf: tweet.retweetOf
			? {
					id: tweet.retweetOf.id,
					text: tweet.retweetOf.text,
					user: {
						id: tweet.retweetOf.user?.id,
						description: tweet.retweetOf.user?.description,
						displayName: tweet.retweetOf.user?.displayName,
						name: tweet.retweetOf.user?.name
					},
					createdAt: tweet.retweetOf.createdAt
			  }
			: undefined,
		isBookmarked: false,
		isLiked: false,
		user: {
			id: tweet.user?.id,
			description: tweet.user?.description,
			displayName: tweet.user?.displayName,
			name: tweet.user?.name
		}
	};
}

export function createTweetObject(tweet: RawTweetRecord): TweetObject {
	return {
		id: tweet.id,
		createdAt: tweet.createdAt,
		text: tweet.text,
		likeCount: tweet.likeCount,
		quoteOf: tweet.quoteOf?.id,
		quoteCount: tweet.quoteCount,
		retweetCount: tweet.retweetCount,
		retweetOf: undefined,
		isBookmarked: false,
		isLiked: false,
		user: {
			id: tweet.user?.id,
			description: tweet.user?.description,
			displayName: tweet.user?.displayName,
			name: tweet.user?.name
		}
	};
}

export function response(status: number) {
	return new Response(null, { status });
}
