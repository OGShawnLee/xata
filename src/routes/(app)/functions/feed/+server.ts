import type { RequestHandler } from "@sveltejs/kit";
import { response } from "$lib/server/utils";
import { tweetEventSchema } from "$lib/validation/schema";
import { handleFunctionValidation } from "$lib/server/functions";
import { updateUserFollowersFeed } from "$lib/server/feed";

export const POST: RequestHandler = async (event) => {
	const tweet = await handleFunctionValidation(event, tweetEventSchema.parse);
	if (tweet.failed) return response(400);
	updateUserFollowersFeed(tweet.data);
	return response(200);
};
