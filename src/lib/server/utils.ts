import type { SelectedPick } from "@xata.io/client";
import type { Nullable, NullableRecursively } from "malachite-ui/types";
import type { NotificationsRecord, TweetsRecord } from "./xata";
import { useAwait } from "$lib/hooks";
import { genSalt, hash } from "bcrypt";

type QueryTweet = SelectedPick<
	TweetsRecord,
	(
		| "*"
		| QueryTweetUser
		| (QueryTweetQuoteOf | QueryTweetReplyOfComplete)
		| QueryTweetReplyOf
		| QueryTweetRetweetOf
	)[]
>;

type QueryTweetQuoteOf =
	| "quoteOf.createdAt"
	| "quoteOf.text"
	| "quoteOf.user.description"
	| "quoteOf.user.displayName"
	| "quoteOf.user.name";
type QueryTweetReplyOf =
	| "replyOf.user.description"
	| "replyOf.user.displayName"
	| "replyOf.user.name";
type QueryTweetReplyOfComplete =
	| "*"
	| "replyOf.user.description"
	| "replyOf.user.displayName"
	| "replyOf.user.name";
type QueryTweetRetweetOf =
	| "retweetOf.createdAt"
	| "retweetOf.text"
	| "retweetOf.user.description"
	| "retweetOf.user.displayName"
	| "retweetOf.user.name"
	| "retweetOf.quoteOf.*"
	| "retweetOf.quoteOf.user";
type QueryTweetUser = "user.displayName" | "user.name" | "user.description";

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

export function createNotificationObject(
	notification: SelectedPick<
		NotificationsRecord,
		(
			| "*"
			| "tweet.text"
			| "from.displayName"
			| "from.name"
			| "reply.*"
			| "reply.user.displayName"
			| "reply.user.name"
			| "reply.user.description"
		)[]
	>,
	reply?: TweetObject
): NotificationObject {
	return {
		id: notification.id,
		createdAt: notification.createdAt,
		type: notification.type as NotificationEventType,
		from: {
			name: notification.from?.name,
			displayName: notification.from?.displayName
		},
		tweet: {
			text: notification.tweet?.text
		},
		reply: reply
	};
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
		replyCount: tweet.replyCount,
		isBookmarked: false,
		isLiked: false,
		user: createUserObject(tweet.user)
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
					user: createUserObject(tweet.quoteOf.user),
					createdAt: tweet.quoteOf.createdAt
			  }
			: undefined,
		quoteCount: tweet.quoteCount,
		retweetCount: tweet.retweetCount,
		retweetOf: undefined,
		replyCount: tweet.replyCount,
		isBookmarked: false,
		isLiked: false,
		user: createUserObject(tweet.user)
	};
}

export function createTweetObject(tweet: QueryTweet): TweetObject {
	return {
		id: tweet.id,
		createdAt: tweet.createdAt,
		text: tweet.text,
		likeCount: tweet.likeCount,
		quoteOf: tweet.quoteOf
			? {
					id: tweet.quoteOf.id,
					text: tweet.quoteOf.text,
					user: createUserObject(tweet.quoteOf.user),
					createdAt: tweet.quoteOf.createdAt
			  }
			: undefined,
		quoteCount: tweet.quoteCount,
		retweetCount: tweet.retweetCount,
		retweetOf: tweet.retweetOf
			? {
					id: tweet.retweetOf.id,
					text: tweet.retweetOf.text,
					user: createUserObject(tweet.retweetOf.user),
					createdAt: tweet.retweetOf.createdAt,
					quoteOf: tweet.retweetOf.quoteOf
						? {
								id: tweet.retweetOf.quoteOf.id,
								text: tweet.retweetOf.quoteOf.text,
								createdAt: tweet.retweetOf.quoteOf.createdAt,
								user: createUserObject(tweet.retweetOf.quoteOf.user)
						  }
						: undefined
			  }
			: undefined,
		replyCount: tweet.replyCount,
		replyOf: tweet.replyOf ? createTweetObject(tweet.replyOf) : undefined,
		isBookmarked: false,
		isLiked: false,
		user: createUserObject(tweet.user)
	};
}

export function createUserObject(
	user: Nullable<{ id: string | undefined } & NullableRecursively<UserObject>>
): UserObject {
	return {
		id: user?.id,
		description: user?.description,
		displayName: user?.displayName,
		name: user?.name
	};
}

export function response(status: number) {
	return new Response(null, { status });
}
