import type { LayoutServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { getInbox } from '$lib/server/chat'

export const load: LayoutServerLoad = async ({ locals: { user } }) => {
	if (user.isAnonymous) throw redirect(303, "/auth/sign-in");
	const inbox = await getInbox(user.data.id);
	if (inbox.failed) throw error(500, { message: "UNABLE TO LOAD INBOX." });
	return { inbox: inbox.data, user: user.data };
};
