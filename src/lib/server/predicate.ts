import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { compare } from "bcrypt";

export function isDuplicateDisplayNameAndEmail(displayName: string, email: string) {
	return useAwait(() => {
		return Promise.all([isDuplicateDisplayName(displayName), isDuplicateEmail(email)]);
	});
}

async function isDuplicateDisplayName(displayName: string) {
	const user = await client.db.users.filter("displayName", displayName).getFirst();
	return Boolean(user);
}

async function isDuplicateEmail(email: string) {
	const user = await client.db.users.filter("email", email).getFirst();
	return Boolean(user);
}

export function isIncorrectPassword(password: string, password_hash: string) {
	return useAwait(async () => {
		const is_correct = await compare(password, password_hash);
		return !is_correct;
	});
}