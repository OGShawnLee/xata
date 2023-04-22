import type { RequestHandler } from "./$types";
import { findUsersWhoLikedTweet } from "$lib/server/like";
import { stringify } from "devalue";

export const GET: RequestHandler = async ({ params: { id } }) => {
	const data = await findUsersWhoLikedTweet(id);
	const status = data.failed ? 500 : 200;
	const body = data.failed ? { message: "Unable to load data." } : data.data;
	return new Response(stringify(body), { status });
};
