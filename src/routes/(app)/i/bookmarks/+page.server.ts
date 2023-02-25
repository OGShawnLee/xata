import type { PageServerLoad } from "./$types";
import { getBookmarks } from "$lib/server/bookmark";
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const bookmarks = await getBookmarks(user.data.id);
	if (bookmarks.failed) throw error(500, { message: "Unable to load Bookmarks." });
	return { bookmarks: bookmarks.data };
};