import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { getNotifications } from "$lib/server/notification";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const feed = await getNotifications(user.data.id);
	if (feed.failed) throw error(500, { message: "Unable to get notifications." });
	return { user: user.data, feed: feed.data };
};
