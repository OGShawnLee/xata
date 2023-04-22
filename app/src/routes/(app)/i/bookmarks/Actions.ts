import type { RequestEvent } from "./$types";
import type { ZodError } from "zod";
import { useCatch } from "$lib/hooks";
import { folderSchema } from "$lib/validation/schema";
import { error, fail, redirect } from "@sveltejs/kit";
import { createBookmarkFolder } from "$lib/server/bookmark";

export default class Action {
	static async createFolder({ locals, request }: RequestEvent) {
		if (locals.user.isAnonymous) throw redirect(303, "/auth/sign-in");

		const data = await request.formData();
		const name = data.get("name");
		const description = data.get("description");

		const folder = useCatch(() => folderSchema.parse({ description, name }));
		if (folder.failed) {
			const errors = (folder.error as ZodError).flatten().fieldErrors;
			return fail(400, {
				description: { value: description, error: errors.description?.[0] },
				name: { value: name, error: errors.name?.[0] }
			});
		}

		const result = await createBookmarkFolder(
			locals.user.data.id,
			folder.data.description,
			folder.data.name
		);
		if (result.failed) throw error(500, { message: "Unable to create bookmark folder." });
	}
}
