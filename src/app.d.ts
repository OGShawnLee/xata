// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: { isAnonymous: false; data: JWTPayloadState } | { isAnonymous: true };
		}
		// interface PageData {}
		// interface Platform {}
	}

	interface JWTPayloadState {
		id: string;
		displayName: string;
		name: string;
	}
}

export {};
