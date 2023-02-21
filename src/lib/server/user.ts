import type { UsersRecord } from "$lib/server/xata";
import client from "$lib/server/client";
import { use_await } from "$lib/hooks";

export function create_user(
	data: Pick<UsersRecord, "displayName" | "email" | "name" | "password">
) {
	return use_await(async () => {
		const user = await client.db.users.create(data);
		return user.toSerializable();
	});
}

export function find_user(display_name: string) {
	return use_await(async () => {
		const user = await client.db.users.filter("displayName", display_name).getFirst();
		return user?.toSerializable();
	});
}
