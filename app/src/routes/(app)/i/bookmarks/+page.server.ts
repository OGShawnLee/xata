import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { getBookmarks } from "$lib/server/bookmark";
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const feed = await getBookmarks(user.data.id);
	if (feed.failed) throw error(500, { message: "Unable to load Bookmarks." });
	return { feed: feed.data };
};

export const actions: Actions = {
	"create-folder": Action.createFolder
};
