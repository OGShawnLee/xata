import { useAwait } from "$lib/hooks";
import { genSalt, hash } from "bcrypt";

export function createPasswordHash(password: string) {
	return useAwait(async () => {
		return hash(password, await genSalt());
	});
}
