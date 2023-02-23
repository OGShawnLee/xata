<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import Header from "./Header.svelte";
	import { Bookmark } from "./Button";
	import { currentUser } from "$lib/state";

	export let displayName: Nullable<string>;
	export let name: Nullable<string>;
	export let createdAt: Date;
	export let id: string;
	export let text: string;
	export let isBookmarked: boolean;
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="px-8 | grid gap-1.25">
		<Header {displayName} {name} {createdAt} />
		<p class="whitespace-pre-line" class:pb-2.75={$currentUser}>{text}</p>
		{#if $currentUser}
			<Bookmark {id} {isBookmarked} />
		{/if}
	</div>
</article>
