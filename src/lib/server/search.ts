import type { Tweet, User } from "@types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish } from "malachite-ui/predicate";

function findUserObject(id: string) {
	return useAwait<User | undefined>(async () => {
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

export function getSearchResults(query: string, target: "people" | null) {
	return useAwait(async () => {
		if (target === "people") {
			const results = await client.db.users.search(query, {
				target: ["description", "displayName", "name", "location"],
				prefix: "phrase"
			});
			return results.map<User>((record) => {
				return {
					id: record.id,
					description: record.description,
					displayName: record.displayName,
					name: record.name
				};
			});
		} else {
			const cachedUsers = new Map<string, User>();
			const results = await client.db.tweets.search(query, {
				target: ["text"],
				prefix: "phrase"
			});

			return Promise.all(
				results.map(async (record) => {
					if (isNullish(record.user)) throw Error("Tweet User ID not defined.");
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

					if (tweet.user) return tweet as Tweet;

					const targetUser = await findUserObject(record.user.id);
					if (targetUser.failed || isNullish(targetUser.data)) throw Error("Unable to Fetch User.");

					cachedUsers.set(record.user.id, targetUser.data);
					tweet.user = targetUser.data;
					return tweet as Tweet;
				})
			);
		}
	});
}
