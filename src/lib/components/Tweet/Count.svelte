<script lang="ts">
	import type { Action } from "svelte/action";
	import { plural } from "$lib/utils";

	export let count: number;
	export let href: string | undefined = undefined;
	export let word: string;
	export let use: Action<HTMLElement> = () => {};

	const as = href ? "a" : "span";
</script>

{#if count}
	<svelte:element
		class={as === "a" ? "hover:(underline underline-white)" : undefined}
		this={as}
		{href}
		use:use
	>
		<b class="text-sm font-victor">{count}</b>
		<span class="text-sm text-zinc-500">
			{plural(count, word)}
		</span>
	</svelte:element>
{/if}
