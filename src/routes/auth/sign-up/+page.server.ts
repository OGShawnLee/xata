import type { Actions } from "./$types";
import type { ZodError } from "zod";
import { use_await } from "$lib/hooks";
import { error_message, user_schema } from "$lib/validation/schema";
import { fail, redirect } from "@sveltejs/kit";
import { is_duplicate_display_name_and_email } from "$lib/server/predicate";
import { create_user } from "$lib/server/user";
import { create_password_hash } from "$lib/server/utils";

export const actions: Actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const display_name = data.get("display-name");
		const email = data.get("email");
		const name = data.get("name");
		const password = data.get("password");

		const user = await use_await(() => {
			return user_schema.parse({ display_name, email, name, password });
		});
		if (user.failed) {
			const errors = (user.error as ZodError).flatten().fieldErrors;
			return fail(400, {
				display_name: { value: display_name, error: errors.display_name?.[0] },
				email: { value: email, error: errors.email?.[0] },
				name: { value: name, error: errors.name?.[0] },
				password: { error: errors.password?.[0] }
			});
		}

		const duplicate_validation = await is_duplicate_display_name_and_email(
			user.data.display_name,
			user.data.email
		);
		if (duplicate_validation.failed) {
			return fail(500, {
				error: "Unable to verify username and email.",
				display_name: { value: user.data.display_name },
				email: { value: user.data.email },
				name: { value: user.data.name }
			});
		}

		const [is_dupe_display_name, is_dupe_email] = duplicate_validation.data;
		if (is_dupe_display_name || is_dupe_email) {
			return fail(400, {
				display_name: {
					value: user.data.display_name,
					error: is_dupe_display_name ? error_message.duplicate("Username") : undefined
				},
				email: {
					value: user.data.email,
					error: is_dupe_email ? error_message.duplicate("Email") : undefined
				},
				name: { value: user.data.name }
			});
		}

		const hash = await create_password_hash(user.data.password);
		if (hash.failed) return exit(user.data.display_name, user.data.email, user.data.name);

		const new_user = await create_user({
			displayName: user.data.display_name,
			email: user.data.email,
			name: user.data.name,
			password: hash.data
		});
		if (new_user.failed) return exit(user.data.display_name, user.data.email, user.data.name);

		throw redirect(303, "/auth/sign-in");
	}
};

function exit(display_name: string, email: string, name: string) {
	return fail(500, {
		error: "Unable to create account",
		display_name: { value: display_name },
		email: { value: email },
		name: { value: name }
	});
}
