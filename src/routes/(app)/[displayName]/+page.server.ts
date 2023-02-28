import type { PageServerLoad } from "./$types";
import { getUserTweets } from "$lib/server/user";
import { error } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";

export const load: PageServerLoad = async ({ locals: { user }, params: { displayName } }) => {
	const tweets = await useAwait(() =>
		getUserTweets(displayName, user.isSignedIn ? user.data.id : undefined)
	);
	if (tweets.failed) throw error(500, { message: "Unable to load user Tweets." });
	return { tweets: tweets.data };
};