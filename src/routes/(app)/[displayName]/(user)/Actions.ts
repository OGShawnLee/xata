import type { RequestEvent } from "./$types";
import type { ZodError } from "zod";
import { userSchema } from "$lib/validation/schema";
import { error, fail } from "@sveltejs/kit";
import { findUserPublic, updateUserProfile } from "$lib/server/user";
import { useAwait } from "$lib/hooks";
import { setAuthCookie } from "$lib/server/auth";
import { isNullish } from "malachite-ui/predicate";
import { follow } from "$lib/server/follow";

const schema = userSchema.pick({ name: true, description: true, location: true });

export default class {
	static async edit({ cookies, locals, params, request }: RequestEvent) {
		if (locals.user.isAnonymous) throw error(400, { message: "User not logged in." });
		if (params.displayName !== locals.user.data.displayName)
			throw error(403, { message: "Action Forbidden." });

		const data = await request.formData();
		const description = data.get("description");
		const location = data.get("location");
		const name = data.get("name");

		const profile = await useAwait(() => schema.parse({ description, location, name }));
		if (profile.failed) {
			const errors = (profile.error as ZodError).flatten().fieldErrors;
			console.log(errors);
			return fail(400, {
				description: { value: description, error: errors.description?.[0] },
				location: { value: location, error: errors.location?.[0] },
				name: { value: name, error: errors.name?.[0] }
			});
		}

		const user = await updateUserProfile(locals.user.data.id, profile.data);
		if (user.failed) throw error(500, { message: "Unable to update profile." });
		setAuthCookie(cookies, {
			id: user.data.id,
			displayName: locals.user.data.displayName,
			name: profile.data.name
		});
	}

	static async follow({ locals, params }: RequestEvent) {
		if (locals.user.isAnonymous) throw error(400, { message: "User not logged in." });
		if (locals.user.data.displayName === params.displayName)
			throw error(400, { message: "Can't follow yourself." });

		const targetUser = await useAwait(() => findUserPublic(params.displayName));
		if (targetUser.failed) throw error(500, { message: "Unable to follow user" });
		if (isNullish(targetUser.data))
			throw error(404, { message: "Can't follow user that does not exist." });

		const result = await follow(targetUser.data.id, locals.user.data.id);
		if (result.failed) throw error(500, { message: "Unable to follow user." });
	}
}
