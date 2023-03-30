import type { PageServerLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { getUserFollowers } from "$lib/server/user";

export const load: PageServerLoad = async ({ parent }) => {
	const { foundUser } = await parent();
	const followers = await getUserFollowers(foundUser.id);

	if (followers.failed) throw error(500, { message: "Unable to find user followers." });

	return { followers: followers.data };
};
