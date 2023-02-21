import type { Cookies } from "@sveltejs/kit";
import { ACCESS_TOKEN, AUTH_COOKIE } from "$env/static/private";
import { sign } from "jsonwebtoken";

function create_user_jwt(payload: JWTPayloadState) {
	return sign(payload, ACCESS_TOKEN, { expiresIn: "3d" });
}

export function set_auth_cookie(
	cookies: Cookies,
	payload: { id: string; display_name: string; name: string }
) {
	const token = create_user_jwt(payload);
	cookies.set(AUTH_COOKIE, token, { maxAge: 60 * 60 * 24 * 3, httpOnly: true, path: "/" });
}
