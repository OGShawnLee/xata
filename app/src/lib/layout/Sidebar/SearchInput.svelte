<script lang="ts">
	import type { Maybe } from "malachite-ui/types";
	import { page } from "$app/stores";
	import { Search } from "lucide-svelte";

	let className: Maybe<string> = undefined;

	export { className as class };
	export let big = false;
</script>

<form class={className} action="/search">
	<label class="sr-only" for="query">Search Term</label>
	<div
		class="group {big
			? 'pl-3 h-12'
			: 'pl-2 h-10'} | flex items-center gap-1.75 | border-2 border-zinc-800 rounded-xl overflow-hidden"
	>
		<Search class="group-focus-within:stroke-white" />
		<input
			class="w-full h-full px-2 | bg-transparent outline-none focus:text-white"
			type="text"
			id="query"
			name="query"
			placeholder="Search"
			minlength={1}
			maxlength={280}
		/>
		{#if $page.url.searchParams.get("target") === "people"}
			<input type="hidden" name="target" value="people" />
		{/if}
	</div>
</form>
