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

	interface JWTPayloadState {
		id: string;
		displayName: string;
		name: string;
	}

	interface UserState extends JWTPayloadState {
		description?: Nullable<string>;
		location?: Nullable<string>;
	}

	type NotificationEventType = "LIKE" | "RETWEET";

	interface NotificationEvent {
		"from.id": string;
		"to.id": string;
		"tweet.id": string;
		type: NotificationEventType;
	}

	interface TweetLikeUserObject {
		id: string;
		likedAt: Date;
		user: {
			id: string | undefined;
			description: Nullable<string>;
			displayName: Nullable<string>;
			name: Nullable<string>;
		};
	}

	interface TweetObject {
		id: string;
		createdAt: Date;
		text: string;
		likeCount: number;
		retweetCount: number;
		retweetOf: string | undefined;
		isBookmarked: boolean;
		isLiked: boolean;
		user: {
			id: string | undefined;
			name: Nullable<string>;
			displayName: Nullable<string>;
		};
	}
}

export {};
