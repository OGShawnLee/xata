import { use_await } from "$lib/hooks";
import client from "$lib/server/client";

export function is_duplicate_display_name_and_email(email: string, display_name: string) {
	return use_await(() => {
		return Promise.all([is_duplicate_display_name(display_name), is_duplicate_email(email)]);
	});
}

async function is_duplicate_display_name(display_name: string) {
	const user = await client.db.users.filter("displayName", display_name).getFirst();
	return Boolean(user);
}

async function is_duplicate_email(email: string) {
	const user = await client.db.users.filter("email", email).getFirst();
	return Boolean(user);
}