import type { ZodError } from "zod";
import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { user_schema } from "$lib/validation/schema";
import { use_await } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { find_user } from "$lib/server/user";
import { is_incorrect_password } from "$lib/server/predicate";
import { set_auth_cookie } from "$lib/server/auth";

const schema = user_schema.pick({ display_name: true, password: true });

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const display_name = data.get("display-name");
		const password = data.get("password");

		const user = await use_await(() => {
			return schema.parse({ display_name, password });
		});
		if (user.failed) {
			const errors = (user.error as ZodError).flatten().fieldErrors;
			return fail(400, {
				display_name: { value: display_name, error: errors.display_name?.[0] },
				password: { error: errors.password?.[0] }
			});
		}

		const found_user = await find_user(user.data.display_name);
		if (found_user.failed) return exit(user.data.display_name);
		if (isNullish(found_user.data)) {
			return fail(500, {
				display_name: { value: user.data.display_name, error: "User does not exist." }
			});
		}

		const incorrect_password = await is_incorrect_password(
			user.data.password,
			found_user.data.password!
		);
		if (incorrect_password.failed) return exit(user.data.display_name);
		if (incorrect_password.data)
			return fail(400, {
				display_name: { value: display_name },
				password: { error: "Incorrect password." }
			});

		set_auth_cookie(cookies, {
			id: found_user.data.id,
			display_name: found_user.data.display_name!,
			name: found_user.data.name!
		});
		throw redirect(303, "/home");
	}
};

function exit(display_name: string) {
	return fail(500, {
		error: "Unable to validate user.",
		display_name: { value: display_name }
	});
}
