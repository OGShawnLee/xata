import type { PageServerLoad } from "./$types";
import type { Tweet, User } from '@types'
import { getSearchResults } from "$lib/server/search";
import { isNullish } from "malachite-ui/predicate";
import { error } from "@sveltejs/kit";
import { isDefined } from "$lib/utils/predicate";

export const load: PageServerLoad = async (event) => {
	const query = event.url.searchParams.get("query");
	const target = event.url.searchParams.get("target");

	if (isDefined(target) && target !== "people")
		throw error(500, { message: "Invalid Search Target." });
	if (isNullish(query)) throw error(500, { message: "Search Term cannot be nullish." });

	const results = await getSearchResults(query, target);
	if (results.failed) throw error(500, { message: "Unable to get search results." });
	if (target === "people") {
		return {
			query,
			results: { people: results.data as User[] }
		};
	} else {
		return {
			query,
			results: { tweets: results.data as Tweet[] }
		};
	}
};
