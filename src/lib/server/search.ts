import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";

function findUserObject(id: string) {
	return useAwait<UserObject | undefined>(async () => {
		const foundUser = await client.db.users
			.filter("id", id)
			.select(["description", "displayName", "name"])
			.getFirst();
		if (isNullish(foundUser)) return;
		return {
			id: foundUser.id,
			description: foundUser.description,
			displayName: foundUser.displayName,
			name: foundUser.name
		};
	});
}

export function getSearchResults(query: string) {
	return useAwait(async () => {
		const results = await client.search.all(query, {
			tables: [
				{
					table: "tweets",
					target: ["text"]
				},
				{
					table: "users",
					target: ["description", "displayName", "name", "location"]
				}
			],
			prefix: "phrase"
		});

		// We only have 2 users so this is not a bad idea
		const cachedUsers = new Map<string, UserObject>();
		const tweets: TweetObject[] = [];
		const users: UserObject[] = [];

		for await (const { table, record } of results) {
			if (table === "users") {
				const foundUser = cachedUsers.get(record.id);
				if (foundUser) users.push(foundUser);
				else {
					const user = {
						id: record.id,
						description: record.description,
						displayName: record.displayName,
						name: record.name
					};
					cachedUsers.set(user.id, user);
					users.push(user);
				}
			} else {
				if (isNullish(record.user)) continue;
				const foundUser = cachedUsers.get(record.user.id);
				const tweet = {
					id: record.id,
					createdAt: record.createdAt,
					user: foundUser,
					text: record.text,
					likeCount: record.likeCount,
					quoteOf: undefined,
					quoteCount: record.quoteCount,
					retweetCount: record.retweetCount,
					retweetOf: undefined,
					replyCount: record.replyCount,
					isBookmarked: false,
					isLiked: false
				};
				if (tweet.user) tweets.push(tweet as TweetObject);
				else {
					const foundUser = await findUserObject(record.user.id);
					if (foundUser.failed || isNullish(foundUser.data)) continue;
					cachedUsers.set(record.user.id, foundUser.data);
					tweet.user = foundUser.data;
					tweets.push(tweet as TweetObject);
				}
			}
		}

		return { tweets, users };
	});
}
