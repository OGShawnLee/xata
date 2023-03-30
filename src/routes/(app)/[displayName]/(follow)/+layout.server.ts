import type { LayoutServerLoad } from "./$types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { error } from "@sveltejs/kit";
import { isNullish } from "malachite-ui/predicate";

export const load: LayoutServerLoad = async ({ params: { displayName } }) => {
	const foundUser = await useAwait(() => {
		return client.db.users.filter("displayName", displayName).select(["name"]).getFirst();
	});

	if (foundUser.failed) throw error(500, { message: "Unable to find user." });
	if (isNullish(foundUser.data)) throw error(404, { message: "User not found." });

	return { foundUser: { id: foundUser.data.id, displayName, name: foundUser.data.name } };
};
