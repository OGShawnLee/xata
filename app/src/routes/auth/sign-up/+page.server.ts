import type { Actions } from "./$types";
import type { ZodError } from "zod";
import { useAwait } from "$lib/hooks";
import { errorMessage, userSchema } from "$lib/validation/schema";
import { fail, redirect } from "@sveltejs/kit";
import { isDuplicateDisplayNameAndEmail } from "$lib/server/predicate";
import { createUser } from "$lib/server/user";
import { createPasswordHash } from "$lib/server/utils";

const schema = userSchema.pick({ displayName: true, email: true, name: true, password: true });

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const displayName = data.get("display-name");
		const email = data.get("email");
		const name = data.get("name");
		const password = data.get("password");

		const user = await useAwait(() => {
			return schema.parse({ displayName, email, name, password });
		});
		if (user.failed) {
			const errors = (user.error as ZodError).flatten().fieldErrors;
			return fail(400, {
				displayName: { value: displayName, error: errors.displayName?.[0] },
				email: { value: email, error: errors.email?.[0] },
				name: { value: name, error: errors.name?.[0] },
				password: { error: errors.password?.[0] }
			});
		}

		const duplicate_validation = await isDuplicateDisplayNameAndEmail(
			user.data.displayName,
			user.data.email
		);
		if (duplicate_validation.failed) {
			return fail(500, {
				error: "Unable to verify username and email.",
				displayName: { value: user.data.displayName },
				email: { value: user.data.email },
				name: { value: user.data.name }
			});
		}

		const [is_dupe_displayName, is_dupe_email] = duplicate_validation.data;
		if (is_dupe_displayName || is_dupe_email) {
			return fail(400, {
				displayName: {
					value: user.data.displayName,
					error: is_dupe_displayName ? errorMessage.duplicate("Username") : undefined
				},
				email: {
					value: user.data.email,
					error: is_dupe_email ? errorMessage.duplicate("Email") : undefined
				},
				name: { value: user.data.name }
			});
		}

		const hash = await createPasswordHash(user.data.password);
		if (hash.failed) return exit(user.data.displayName, user.data.email, user.data.name);

		const new_user = await createUser({
			displayName: user.data.displayName,
			email: user.data.email,
			name: user.data.name,
			password: hash.data
		});
		if (new_user.failed) return exit(user.data.displayName, user.data.email, user.data.name);

		throw redirect(303, "/auth/sign-in");
	}
};

function exit(displayName: string, email: string, name: string) {
	return fail(500, {
		error: "Unable to create account",
		displayName: { value: displayName },
		email: { value: email },
		name: { value: name }
	});
}
