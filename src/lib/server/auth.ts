import type { Cookies } from "@sveltejs/kit";
import { ACCESS_TOKEN, AUTH_COOKIE } from "$env/static/private";
import { sign, verify } from "jsonwebtoken";
import { isNullish, isWhitespace } from "malachite-ui/predicate";
import { useAwait } from "$lib/hooks";
import { isAuthTokenState } from "./predicate";

function createUserJWT(payload: JWTPayloadState) {
	return sign(payload, ACCESS_TOKEN, { expiresIn: "3d" });
}

export function deleteAuthCookie(cookies: Cookies) {
	cookies.set(AUTH_COOKIE, "", { expires: new Date(Date.now() - 3600), httpOnly: true, path: "/" });
}

export async function getCurrentUser(cookies: Cookies): Promise<
	| {
			failed: true;
			reason: "UNAUTHENTICATED" | "INVALID";
	  }
	| { failed: false; data: JWTPayloadState }
> {
	const authCookie = cookies.get(AUTH_COOKIE);
	if (isNullish(authCookie) || isWhitespace(authCookie))
		return { failed: true, reason: "UNAUTHENTICATED" };

	const authTokenState = await getAuthTokenState(authCookie);
	if (authTokenState.failed) return { failed: true, reason: "INVALID" };

	return { failed: false, data: authTokenState.data };
}

function getAuthTokenState(authCookie: string) {
	return useAwait(() => {
		const payload = verify(authCookie, ACCESS_TOKEN);
		if (isAuthTokenState(payload)) return payload;
		throw Error("Invalid Auth Token");
	});
}

export function setAuthCookie(
	cookies: Cookies,
	payload: { id: string; displayName: string; name: string }
) {
	const token = createUserJWT(payload);
	cookies.set(AUTH_COOKIE, token, { maxAge: 60 * 60 * 24 * 3, httpOnly: true, path: "/" });
}
