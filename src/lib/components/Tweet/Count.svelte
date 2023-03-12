<script lang="ts">
	import type { Action } from "svelte/action";
	import { plural } from "$lib/utils";

	export let count: number;
	export let href: string;
	export let word: string;
	export let use: Action<HTMLAnchorElement> = () => {};
</script>

{#if count}
	<a class="hover:(underline underline-white)" {href} use:use>
		<b class="text-sm font-victor">{count}</b>
		<span class="text-sm text-zinc-500">
			{plural(count, word)}
		</span>
	</a>
{/if}
