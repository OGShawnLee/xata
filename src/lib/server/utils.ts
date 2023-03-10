import type { SelectedPick } from "@xata.io/client";
import type { TweetsRecord } from "./xata";
import { useAwait } from "$lib/hooks";
import { genSalt, hash } from "bcrypt";

type TweetRecordComplete = SelectedPick<
	TweetsRecord,
	(
		| "*"
		| "user.displayName"
		| "user.id"
		| "user.name"
		| "user.description"
		| "quoteOf.createdAt"
		| "quoteOf.text"
		| "quoteOf.user.description"
		| "quoteOf.user.displayName"
		| "quoteOf.user.name"
		| "retweetOf.createdAt"
		| "retweetOf.text"
		| "retweetOf.user.description"
		| "retweetOf.user.displayName"
		| "retweetOf.user.name"
		| "retweetOf.quoteOf.*"
		| "retweetOf.quoteOf.user"
	)[]
>;

type TweetRecordMinimal = SelectedPick<
	TweetsRecord,
	("*" | "user.displayName" | "user.id" | "user.name" | "user.description")[]
>;

type TweetRecordNoRetweet = SelectedPick<
	TweetsRecord,
	(
		| "*"
		| "user.displayName"
		| "user.id"
		| "user.name"
		| "user.description"
		| "quoteOf.createdAt"
		| "quoteOf.text"
		| "quoteOf.user.description"
		| "quoteOf.user.displayName"
		| "quoteOf.user.name"
	)[]
>;

export function createPasswordHash(password: string) {
	return useAwait(async () => {
		return hash(password, await genSalt());
	});
}

export function createTweetObjectMinimal(tweet: TweetRecordMinimal) {
	return {
		id: tweet.id,
		createdAt: tweet.createdAt,
		text: tweet.text,
		likeCount: tweet.likeCount,
		quoteCount: tweet.quoteCount,
		quoteOf: undefined,
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

export function createTweetObjectNoRetweet(tweet: TweetRecordNoRetweet) {
	return {
		id: tweet.id,
		createdAt: tweet.createdAt,
		text: tweet.text,
		likeCount: tweet.likeCount,
		quoteOf: tweet.quoteOf
			? {
					id: tweet.quoteOf.id,
					text: tweet.quoteOf.text,
					user: {
						id: tweet.quoteOf.user?.id,
						description: tweet.quoteOf.user?.description,
						displayName: tweet.quoteOf.user?.displayName,
						name: tweet.quoteOf.user?.name
					},
					createdAt: tweet.quoteOf.createdAt
			  }
			: undefined,
		quoteCount: tweet.quoteCount,
		retweetCount: tweet.retweetCount,
		retweetOf: undefined,
		replyCount: tweet.replyCount,
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
		replyCount: tweet.replyCount,
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

export function createTweetObject(tweet: TweetRecordComplete): TweetObject {
	return {
		id: tweet.id,
		createdAt: tweet.createdAt,
		text: tweet.text,
		likeCount: tweet.likeCount,
		quoteOf: tweet.quoteOf
			? {
					id: tweet.quoteOf.id,
					text: tweet.quoteOf.text,
					user: {
						id: tweet.quoteOf.user?.id,
						description: tweet.quoteOf.user?.description,
						displayName: tweet.quoteOf.user?.displayName,
						name: tweet.quoteOf.user?.name
					},
					createdAt: tweet.quoteOf.createdAt
			  }
			: undefined,
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
					createdAt: tweet.retweetOf.createdAt,
					quoteOf: tweet.retweetOf.quoteOf
						? {
								id: tweet.retweetOf.quoteOf.id,
								text: tweet.retweetOf.quoteOf.text,
								createdAt: tweet.retweetOf.quoteOf.createdAt,
								user: {
									id: tweet.retweetOf.quoteOf.user?.id,
									description: tweet.retweetOf.quoteOf.user?.description,
									displayName: tweet.retweetOf.quoteOf.user?.displayName,
									name: tweet.retweetOf.quoteOf.user?.name
								}
						  }
						: undefined
			  }
			: undefined,
		replyCount: tweet.replyCount,
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
