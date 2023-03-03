import type { LayoutServerLoad } from "./$types";
import { findUserPublic } from "$lib/server/user";
import { error } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";

export const load: LayoutServerLoad = async ({ params }) => {
	const foundUser = await useAwait(() => findUserPublic(params.displayName));
	if (foundUser.failed) throw error(500, { message: "Unable to load User data." });
	if (isNullish(foundUser.data)) throw error(404, { message: "User not found." });
	return { foundUser: foundUser.data };
};
