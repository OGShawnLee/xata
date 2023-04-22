import type { PageServerLoad } from "./$types";
import { getUserLikes } from "$lib/server/user";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	const feed = await getUserLikes(params.displayName, user.isSignedIn ? user.data.id : undefined);
	if (feed.failed) throw error(500, { message: "Unable to load User likes." });
	return { feed: feed.data };
};
