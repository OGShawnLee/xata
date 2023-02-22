import type { ZodError } from "zod";
import type { Actions } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { userSchema } from "$lib/validation/schema";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";
import { findUser } from "$lib/server/user";
import { isIncorrectPassword } from "$lib/server/predicate";
import { setAuthCookie } from "$lib/server/auth";

const schema = userSchema.pick({ displayName: true, password: true });

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		const displayName = data.get("display-name");
		const password = data.get("password");

		const user = await useAwait(() => {
			return schema.parse({ displayName, password });
		});
		if (user.failed) {
			const errors = (user.error as ZodError).flatten().fieldErrors;
			return fail(400, {
				displayName: { value: displayName, error: errors.displayName?.[0] },
				password: { error: errors.password?.[0] }
			});
		}

		const foundUser = await findUser(user.data.displayName);
		if (foundUser.failed) return exit(user.data.displayName);
		if (isNullish(foundUser.data)) {
			return fail(500, {
				displayName: { value: user.data.displayName, error: "User does not exist." }
			});
		}

		const incorrectPassword = await isIncorrectPassword(
			user.data.password,
			foundUser.data.password!
		);
		if (incorrectPassword.failed) return exit(user.data.displayName);
		if (incorrectPassword.data)
			return fail(400, {
				displayName: { value: displayName },
				password: { error: "Incorrect password." }
			});

		setAuthCookie(cookies, {
			id: foundUser.data.id,
			displayName: foundUser.data.displayName!,
			name: foundUser.data.name!
		});
		throw redirect(303, "/home");
	}
};

function exit(displayName: string) {
	return fail(500, {
		error: "Unable to validate user.",
		displayName: { value: displayName }
	});
}
