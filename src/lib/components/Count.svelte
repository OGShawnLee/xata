<script lang="ts">
	import type { Action } from "svelte/action";
	import { plural } from "$lib/utils";

	export let count: number;
	export let href: string | undefined = undefined;
	export let irregular = false;
	export let small = false;
	export let strict = false;
	export let text: string;
	export let use: Action<HTMLElement> = () => {};
	export let user = false;

	$: finalText = irregular ? text : plural(count, text);
	$: if (user) small = strict = true;
	$: textSize = small ? "text-xs" : "text-sm";

	const as = href ? "a" : "span";
</script>

{#if count || strict}
	{#if as === "a"}
		<a class="{textSize} text-zinc-400 hover:underline focus:underline" {href} use:use>
			<b class="text-white"> {count} </b>
			<span> {finalText} </span>
		</a>
	{:else}
		<span class="{textSize} text-zinc-400">
			<b class="text-white"> {count} </b>
			<span> {finalText} </span>
		</span>
	{/if}
{/if}
