import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { findUserTweetWithStatus, getTweetReplies } from "$lib/server/tweet";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export const load: PageServerLoad = async ({ locals, params }) => {
	const tweet = await findUserTweetWithStatus({
		id: params.id,
		displayName: params.displayName,
		cuid: locals.user.isSignedIn ? locals.user.data.id : undefined
	});

	if (tweet.failed) throw error(500, { message: "Unable to find Tweet." });
	if (isNullish(tweet.data)) throw error(404, { message: "Tweet not found." });

	if (tweet.data.replyCount === 0) return { tweet: tweet.data };

	return {
		tweet: tweet.data,
		streamed: {
			replies: getTweetReplies(params.id, locals.user.isAnonymous ? undefined : locals.user.data.id)
		}
	};
};

export const actions: Actions = {
	reply: Action.reply
};
