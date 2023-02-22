import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { getCurrentUser } from "$lib/server/auth";
import { isAuthRoute } from "$lib/server/predicate";

export const handle: Handle = async ({ event, resolve }) => {
	const user = await getCurrentUser(event.cookies);

	if (user.failed) {
		console.log(user.reason);
	} else {
		if (isAuthRoute(event.url.pathname)) throw redirect(303, "/home");
	}

	return resolve(event);
};
