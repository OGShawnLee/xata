import type { RequestHandler } from "./$types";
import { response } from "$lib/server/utils";
import { getNotifications } from "$lib/server/notification";
import { stringify } from "devalue";

export const GET: RequestHandler = async (event) => {
	if (event.locals.user.isAnonymous) return response(401);
	const cursor = event.url.searchParams.get("cursor") || undefined;
	const feed = await getNotifications(event.locals.user.data.id, cursor);
	if (feed.failed) return response(500);
	return new Response(stringify(feed.data), { status: 200 });
};
