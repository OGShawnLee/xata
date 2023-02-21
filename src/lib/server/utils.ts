import { use_await } from "$lib/hooks";
import { genSalt, hash } from "bcrypt";

export function create_password_hash(password: string) {
	return use_await(async () => {
		return hash(password, await genSalt());
	});
}
