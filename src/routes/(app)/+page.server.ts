import type { PageServerLoad } from "./$types";
import { getTweets } from "$lib/server/tweet";
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user.isSignedIn) throw redirect(303, "/home");
	const tweets = await getTweets();
	if (tweets.failed) throw error(500, { message: "Unable to load Tweets." });
	return { tweets: tweets.data };
};
