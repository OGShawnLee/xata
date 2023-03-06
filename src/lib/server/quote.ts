import client from "./client";
import { useAwait } from "$lib/hooks";

export function quote({
	text,
	tweet,
	user
}: {
	text: string;
	tweet: { id: string; quoteCount: number };
	user: { id: string };
}) {
	return useAwait(() => {
		return client.transactions.run([
			{ insert: { table: "tweets", record: { user: user.id, text, quoteOf: tweet.id } } },
			{ update: { table: "tweets", id: tweet.id, fields: { quoteCount: tweet.quoteCount + 1 } } }
		]);
	});
}
