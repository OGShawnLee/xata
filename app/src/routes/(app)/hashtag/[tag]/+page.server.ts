import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getTweetsByHashtag } from "$lib/server/tweet";

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	const tweets = await getTweetsByHashtag(params.tag, user.isAnonymous ? undefined : user.data.id);
	if (tweets.failed) throw error(500, { message: "Unable to load Tweets." });
	return { feed: tweets.data, hashtag: params.tag };
};
