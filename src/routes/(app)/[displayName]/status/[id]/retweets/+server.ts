import type { RequestHandler } from "./$types";
import { stringify } from "devalue";
import { findUsersWhoRetweetedTweet } from "$lib/server/retweet";

export const GET: RequestHandler = async ({ params: { id } }) => {
	const data = await findUsersWhoRetweetedTweet(id);
	const status = data.failed ? 500 : 200;
	const body = data.failed ? { message: "Unable to load data." } : data.data;
	return new Response(stringify(body), { status });
};
