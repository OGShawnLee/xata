import type { PageServerLoad } from "./$types";
import { searchPeople, searchTweets } from "$lib/server/search";
import { isNullish } from "malachite-ui/predicate";
import { error } from "@sveltejs/kit";
import { isDefined } from "$lib/utils/predicate";

export const load: PageServerLoad = async (event) => {
	const query = event.url.searchParams.get("query");
	const target = event.url.searchParams.get("target");

	if (isDefined(target) && target !== "people")
		throw error(500, { message: "Invalid Search Target." });
	if (isNullish(query)) throw error(500, { message: "Search Term cannot be nullish." });

	if (target === "people") {
		const results = await searchPeople(query);
		if (results.failed) throw error(500, { message: "Unable to get search people." });
		return { query, results: { people: results.data } };
	} else {
		const results = await searchTweets(query);
		if (results.failed) throw error(500, { message: "Unable to get search tweets." });
		return { query, results: { tweets: results.data } };
	}
};
