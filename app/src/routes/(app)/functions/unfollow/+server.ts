import type { RequestHandler } from "@sveltejs/kit";
import { response } from "$lib/server/utils";
import { handleFunctionValidation } from "$lib/server/functions";
import { unfollowEventSchema } from "$lib/validation/schema";
import { deleteUserFromFollowingFeed } from "$lib/server/feed";

export const POST: RequestHandler = async (event) => {
	const unfollow = await handleFunctionValidation(event, unfollowEventSchema.parse);
	if (unfollow.failed) return response(400);
	deleteUserFromFollowingFeed(unfollow.data);
	return response(200);
};
