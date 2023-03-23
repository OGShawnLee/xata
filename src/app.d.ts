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
}

export {};
