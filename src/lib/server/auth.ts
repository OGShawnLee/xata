import type { Cookies } from "@sveltejs/kit";
import { ACCESS_TOKEN, AUTH_COOKIE } from "$env/static/private";
import { sign } from "jsonwebtoken";

function createUserJWT(payload: JWTPayloadState) {
	return sign(payload, ACCESS_TOKEN, { expiresIn: "3d" });
}

export function setAuthCookie(
	cookies: Cookies,
	payload: { id: string; displayName: string; name: string }
) {
	const token = createUserJWT(payload);
	cookies.set(AUTH_COOKIE, token, { maxAge: 60 * 60 * 24 * 3, httpOnly: true, path: "/" });
}
