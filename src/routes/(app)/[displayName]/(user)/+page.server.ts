import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { getUserPinnedTweet, getUserTweets } from "$lib/server/user";
import { error } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";

export const load: PageServerLoad = async ({ locals: { user }, params: { displayName } }) => {
	const result = await useAwait(() =>
		Promise.all([
			getUserPinnedTweet(displayName, user.isSignedIn ? user.data.id : undefined),
			getUserTweets(displayName, user.isSignedIn ? user.data.id : undefined)
		])
	);
	if (result.failed) throw error(500, { message: "Unable to load user Tweets." });

	return { pinnedTweet: result.data[0], feed: result.data[1] };
};

export const actions: Actions = {
	default: Action.edit
};
