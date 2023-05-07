<script lang="ts">
	import type { Action } from "svelte/action";
	import { handleExpandableArea } from "$lib/actions";
	import { isWhitespace } from "malachite-ui/predicate";

	export let charCount = 0;
	export let id: string;
	export let name = id;
	export let label: string;
	export let placeholder: string;
	export let maxlength = 280;
	export let element: HTMLTextAreaElement | undefined = undefined;
	export let padding = "py-2.5";
	export let value = "";
	export let disabled = isWhitespace(value);
	export let required = false;

	$: charCount = value.length;
	$: disabled = isWhitespace(value);
</script>

<label class="sr-only" for={id}>{label}</label>
<textarea
	class="w-full {padding} | block | bg-transparent outline-none text-white placeholder-zinc-500 resize-none"
	{name}
	{id}
	cols="10"
	rows="1"
	{maxlength}
	{placeholder}
	{required}
	data-minimum-rows="1"
	on:input={handleExpandableArea}
	bind:value
	bind:this={element}
	on:keydown
/>
