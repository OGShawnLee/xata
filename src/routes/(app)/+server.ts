import type { RequestHandler } from "./$types";
import { stringify } from "devalue";
import { getTweets } from "$lib/server/tweet";

export const GET: RequestHandler = async ({ url }) => {
	const cursor = url.searchParams.get("cursor") ?? undefined;
	const feed = await getTweets(cursor);
	if (feed.failed) return new Response(null, { status: 500 });
	return new Response(stringify(feed.data), { status: 200 });
};
