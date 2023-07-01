<script lang="ts">
	import type { Maybe } from "malachite-ui/types";
	import type { MessageSearch } from "@types";
	import { Input } from "$lib/components";
	import { useAPI } from "$lib/hooks";
	import { isString } from "malachite-ui/predicate";
	import { Search } from "lucide-svelte";

	export let messages: Maybe<MessageSearch[]>;

	async function handleSubmit(this: HTMLFormElement) {
		const data = new FormData(this);
		const query = data.get("query");

		if (!isString(query) || query.length < 1) return;

		const result = await useAPI("/chat/search?query={}", query);
		if (result.failed) return;
		messages = result.data.records;
	}
</script>

<div class="px-8 py-3 | flex items-center gap-3 | border-b-2 border-zinc-800">
	<form class="w-full" on:submit|preventDefault={handleSubmit}>
		<Input id="search" name="query" placeholder="Search Direct Messages" nolabel icon={Search} />
	</form>
</div>
