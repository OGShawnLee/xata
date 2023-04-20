import type { Tweet, User } from "@types";
import client from "$lib/server/client";
import { useAwait } from "$lib/hooks";
import { isNullish, isWhitespace } from "malachite-ui/predicate";

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

export function searchPeople(query: string) {
	return useAwait(async () => {
		if (isWhitespace(query)) return [];
		const records = await client.db.users.search(query, {
			target: ["description", "displayName", "name", "location"],
			prefix: "phrase"
		});
		return records.map<User>((record) => {
			return {
				id: record.id,
				description: record.description,
				displayName: record.displayName,
				name: record.name
			};
		});
	});
}

export function searchTweets(query: string) {
	return useAwait(async () => {
		if (isWhitespace(query)) return [];
		const cachedUsers = new Map<string, User>();
		const records = await client.db.tweets.search(query, {
			target: ["text"],
			prefix: "phrase"
		});
		return Promise.all(
			records.map<Promise<Tweet>>(async (record) => {
				if (isNullish(record.user)) throw Error("Tweet User ID not defined.");
				let foundUser = cachedUsers.get(record.user.id);

				if (isNullish(foundUser)) {
					const user = await findUserObject(record.user.id);
					if (user.failed || isNullish(user.data)) throw Error("Unable to Fetch User.");
					cachedUsers.set(record.user.id, user.data);
					foundUser = user.data;
				}

				return {
					id: record.id,
					createdAt: record.createdAt,
					user: foundUser,
					text: record.text,
					bookmarkCount: record.bookmarkCount,
					likeCount: record.likeCount,
					quoteOf: undefined,
					quoteCount: record.quoteCount,
					retweetCount: record.retweetCount,
					retweetOf: undefined,
					replyOf: undefined,
					replyCount: record.replyCount,
					isBookmarked: false,
					isLiked: false
				};
			})
		);
	});
}
