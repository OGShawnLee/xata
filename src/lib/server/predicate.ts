import client from "$lib/server/client";
import { use_await } from "$lib/hooks";
import { compare } from "bcrypt";

export function is_duplicate_display_name_and_email(display_name: string, email: string) {
	return use_await(() => {
		return Promise.all([is_duplicate_display_name(display_name), is_duplicate_email(email)]);
	});
}

async function is_duplicate_display_name(display_name: string) {
	const user = await client.db.users.filter("display_name", display_name).getFirst();
	return Boolean(user);
}

async function is_duplicate_email(email: string) {
	const user = await client.db.users.filter("email", email).getFirst();
	return Boolean(user);
}

export function is_incorrect_password(password: string, password_hash: string) {
	return use_await(async () => {
		const is_correct = await compare(password, password_hash);
		return !is_correct;
	});
}
