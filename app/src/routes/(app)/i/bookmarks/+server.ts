import type { RequestHandler } from "./$types";
import { stringify } from "devalue";
import { getBookmarks } from "$lib/server/bookmark";

export const GET: RequestHandler = async ({ locals, url }) => {
	if (locals.user.isAnonymous) return new Response(null, { status: 401 });

	const cursor = url.searchParams.get("cursor") ?? undefined;
	const feed = await getBookmarks(locals.user.data.id, cursor);
	if (feed.failed) return new Response(null, { status: 500 });

	return new Response(stringify(feed.data), { status: 200 });
};
