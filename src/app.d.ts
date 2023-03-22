// See https://kit.svelte.dev/docs/types#app

import type { Nullable } from "malachite-ui/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user:
				| { isAnonymous: false; isSignedIn: true; data: JWTPayloadState }
				| { isAnonymous: true; isSignedIn: false };
		}
		// interface PageData {}
		// interface Platform {}
	}

	type Hashtags = string[] | undefined;

	interface JWTPayloadState {
		id: string;
		displayName: string;
		name: string;
	}

	interface NotificationEvent {
		"from.id": string;
		"to.id": string;
		"tweet.id": string;
		"reply.id"?: string;
		type: NotificationEventType;
	}

	type NotificationEventType = "LIKE" | "REPLY" | "RETWEET";

	interface NotificationObject {
		id: string;
		createdAt: Date;
		type: NotificationEventType;
		from: {
			name: Nullable<string>;
			displayName: Nullable<string>;
		};
		tweet: {
			text: Nullable<string>;
		};
		reply?: TweetObject;
	}

	interface Paginated<T> {
		page: {
			cursor: string;
			more: boolean;
		};
		records: T[];
	}

	interface UserObject {
		id: string | undefined;
		name: Nullable<string>;
		displayName: Nullable<string>;
		description: Nullable<string>;
	}

	type QuoteTweetObject = Pick<TweetObject, "id" | "createdAt" | "text" | "user">;

	type RetweetObject = Pick<TweetObject, "id" | "createdAt" | "text" | "user" | "quoteOf">;

	interface TweetLikeUserObject {
		id: string;
		likedAt: Date;
		user: UserObject;
	}

	interface TweetObject {
		id: string;
		createdAt: Date;
		user: UserObject;
		text: string;
		bookmarkCount: number;
		likeCount: number;
		quoteOf: QuoteTweetObject | undefined;
		quoteCount: number;
		retweetCount: number;
		retweetOf: RetweetObject | undefined;
		replyCount: number;
		replyOf: TweetReplyObjectMinimal | undefined;
		isBookmarked: boolean;
		isLiked: boolean;
	}

	interface TweetObjectWithReply extends TweetObject {
		replyOf: TweetObject;
	}

	interface TweetReplyObjectMinimal {
		id: string;
		user: UserObject;
	}

	interface TweetRetweetUserObject {
		id: string;
		retweetedAt: Date;
		user: UserObject;
	}

	interface UserState extends JWTPayloadState {
		description?: Nullable<string>;
		location?: Nullable<string>;
	}
}

export {};
