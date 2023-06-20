import type { RequestHandler } from "./$types";
import { stringify } from "devalue";
import { getInbox } from '$lib/server/chat'

export const GET: RequestHandler = async ({ locals: { user } }) => {
  if (user.isAnonymous) return new Response(null, { status: 400 });
  const inbox = await getInbox(user.data.id);
  if (inbox.failed) return new Response(null, { status: 500 });
  return new Response(stringify(inbox.data), { status: 200 });
}
