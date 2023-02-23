import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { error, redirect } from "@sveltejs/kit";
import { getTweets } from "$lib/server/tweet";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const tweets = await getTweets();
	if (tweets.failed) throw error(500, { message: "Unable to load Tweets." });
	return { user: user.data, tweets: tweets.data };
};

export const actions: Actions = {
	tweet: Action.tweet
};
