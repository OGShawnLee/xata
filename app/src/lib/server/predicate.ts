import type { JWTPayloadState } from "@types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { compare } from "bcrypt";
import { isInterface, isString } from "malachite-ui/predicate";
import { findFollow } from "./follow";
import { isDefined } from "$lib/utils/predicate";

export function isAuthRoute(pathname: string) {
	return pathname.startsWith("/auth");
}

export function isAuthTokenState(value: unknown): value is JWTPayloadState {
	return isInterface<JWTPayloadState>(value, {
		id: isString,
		displayName: isString,
		name: isString
	});
}

export function isDuplicateDisplayNameAndEmail(displayName: string, email: string) {
	return useAwait(() => {
		return Promise.all([isDuplicateDisplayName(displayName), isDuplicateEmail(email)]);
	});
}

async function isDuplicateDisplayName(displayName: string) {
	const user = await client.db.user.filter("displayName", displayName).getFirst();
	return Boolean(user);
}

async function isDuplicateEmail(email: string) {
	const user = await client.db.user.filter("email", email).getFirst();
	return Boolean(user);
}

export async function isFollowed(uid: string, cuid: string) {
	const follow = await findFollow(uid, cuid);
	if (follow.failed) return false;
	return isDefined(follow.data);
}

export function isIncorrectPassword(password: string, password_hash: string) {
	return useAwait(async () => {
		const is_correct = await compare(password, password_hash);
		return !is_correct;
	});
}
