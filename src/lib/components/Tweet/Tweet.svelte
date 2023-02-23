<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import Header from "./Header.svelte";
	import { Bookmark } from "./Button";

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
		<p class="pb-2.75 whitespace-pre-line">{text}</p>
		<Bookmark {id} {isBookmarked} />
	</div>
</article>
