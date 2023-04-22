import type { RequestHandler } from "./$types";
import { stringify } from "devalue";
import { getUserLikes } from "$lib/server/user";

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const cursor = url.searchParams.get("cursor") ?? undefined;
	const feed = await getUserLikes(
		params.displayName,
		locals.user.isAnonymous ? undefined : locals.user.data.id,
		cursor
	);
	if (feed.failed) return new Response(null, { status: 500 });

	return new Response(stringify(feed.data), { status: 200 });
};
