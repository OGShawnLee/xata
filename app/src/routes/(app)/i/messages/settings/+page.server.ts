import type { Actions, PageServerLoad } from "./$types";
import client from "$lib/server/client";
import { error, fail, redirect } from "@sveltejs/kit";
import { useAwait } from "$lib/hooks";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user.isAnonymous) throw redirect(301, "/auth/sign-in");
	const result = await getUserPreferences(locals.user.data.id);
	if (result.failed) throw error(500, { message: "Unable to fetch user preferences." });
	return result.data;
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (locals.user.isAnonymous) throw redirect(303, "/auth/sign-in");
		const data = await request.formData();
		const publicMessaging = data.get("public-message-requests");
		if (publicMessaging === "true" || publicMessaging === "false") {
			const result = await updateUserSettings(locals.user.data.id, publicMessaging === "true");
			return { failed: result.failed };
		} else throw fail(400);
	}
};

function getUserPreferences(uid: string) {
	return useAwait(async () => {
		const preferences = await client.db.user
			.filter("id", uid)
			.select(["hasPublicMessagingEnabled"])
			.getFirstOrThrow();
		return { hasPublicMessagingEnabled: preferences.hasPublicMessagingEnabled };
	});
}

function updateUserSettings(uid: string, hasPublicMessagingEnabled: boolean) {
	return useAwait(async () => {
		return client.db.user.update(uid, { hasPublicMessagingEnabled });
	});
}
