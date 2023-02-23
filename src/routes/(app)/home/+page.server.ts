import type { Actions, PageServerLoad } from "./$types";
import Action from "./Actions";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	return { user: user.data };
};

export const actions: Actions = {
	tweet: Action.tweet
};
