// See https://kit.svelte.dev/docs/types#app
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

	type NotificationEventType = "LIKE" | "RETWEET";

	interface NotificationEvent {
		"from.id": string;
		"to.id": string;
		"tweet.id": string;
		type: NotificationEventType;
	}
}

export {};
