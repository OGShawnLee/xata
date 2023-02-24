import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { error, redirect } from "@sveltejs/kit";
import { getUserFeed } from "$lib/server/user";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const tweets = await getUserFeed(user.data.id);
	if (tweets.failed) throw error(500, { message: "Unable to load Tweets." });
	return { user: user.data, tweets: tweets.data };
};

export const actions: Actions = {
	"bookmark-or-unbookmark": Action.handleBookmark,
	"like-tweet": Action.likeTweet,
	tweet: Action.tweet
};
