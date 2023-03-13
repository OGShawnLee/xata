import type { PageServerLoad } from "./$types";
import { getSearchResults } from "$lib/server/search";
import { isNullish } from "malachite-ui/predicate";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	const query = event.url.searchParams.get("query");
	if (isNullish(query)) throw error(500, { message: "Search Term cannot be nullish." });

	const results = await getSearchResults(query);
	if (results.failed) throw error(500, { message: "Unable to get search results." });

	return { query, results: results.data };
};
