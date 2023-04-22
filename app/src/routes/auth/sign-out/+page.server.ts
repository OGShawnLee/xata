import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { deleteAuthCookie } from "$lib/server/auth";

export const load: PageServerLoad = () => {
	throw redirect(303, "/home");
};

export const actions: Actions = {
	default: (event) => {
		deleteAuthCookie(event.cookies);
		throw redirect(303, "/auth/sign-in");
	}
};
