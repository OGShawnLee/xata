import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { error, redirect } from "@sveltejs/kit";
import { getUserFeed } from "$lib/server/user";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const feed = await getUserFeed(user.data.id);
	if (feed.failed) throw error(500, { message: "Unable to load Tweets." });
	return { user: user.data, feed: feed.data };
};

export const actions: Actions = {
	"bookmark-or-unbookmark": Action.handleBookmark,
	"like-or-unlike": Action.handleLike,
	"highlight-or-unhighlight": Action.handleHighlight,
	pin: Action.pin,
	"quote-tweet": Action.quote,
	retweet: Action.retweet,
	tweet: Action.tweet,
	unpin: Action.unpin
};
