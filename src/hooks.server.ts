import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { deleteAuthCookie, getCurrentUser } from "$lib/server/auth";
import { isAuthRoute } from "$lib/server/predicate";

export const handle: Handle = async ({ event, resolve }) => {
	const user = await getCurrentUser(event.cookies);

	if (user.failed) {
		event.locals.user = { isAnonymous: true, isSignedIn: false };
		if (user.reason === "INVALID") {
			deleteAuthCookie(event.cookies);
			throw redirect(303, "/auth/sign-in");
		}
	} else {
		event.locals.user = { isAnonymous: false, isSignedIn: true, data: user.data };
		if (isAuthRoute(event.url.pathname) && event.url.pathname !== "/auth/sign-out")
			throw redirect(303, "/home");
	}

	return resolve(event);
};
