import type { PageServerLoad } from "./$types";
import { getUserPublicPage } from "$lib/server/user";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export const load: PageServerLoad = async ({ locals: { user }, params: { displayName } }) => {
	const data = await getUserPublicPage(displayName, user.isSignedIn ? user.data.id : undefined);
	if (data.failed) throw error(500, { message: "Unable to load User data." });
	const [foundUser, tweets] = data.data;
	if (isNullish(foundUser) || isNullish(tweets)) throw error(404, { message: "User not found." });
	return { foundUser, tweets };
};
