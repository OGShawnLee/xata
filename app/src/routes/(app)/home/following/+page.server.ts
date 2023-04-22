import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { getUserFollowingFeed } from "$lib/server/feed";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const feed = await getUserFollowingFeed(user.data.id);
	if (feed.failed) throw error(500, { message: "Unable to load Tweets." });
	return { user: user.data, feed: feed.data };
};
