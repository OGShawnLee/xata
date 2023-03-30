import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getUserFollowing } from "$lib/server/user";

export const load: PageServerLoad = async ({ parent }) => {
	const { foundUser } = await parent();
	const following = await getUserFollowing(foundUser.id);

	if (following.failed) throw error(500, { message: "Unable to find user following." });

	return { following: following.data };
};
