import type { PageServerLoad } from "./$types";
import { getUserLikes } from "$lib/server/user";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { user }, params }) => {
	const likes = await getUserLikes(params.displayName, user.isSignedIn ? user.data.id : undefined);
	if (likes.failed) throw error(500, { message: "Unable to load User likes." });
	return { likes: likes.data };
};
