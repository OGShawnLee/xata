<script lang="ts">
	import { handleExpandableArea } from "$lib/actions";

	export let charCount = 0;
	export let id: string;
	export let name = id;
	export let label: string;
	export let placeholder: string;
	export let maxlength = 280;
	export let element: HTMLTextAreaElement | undefined = undefined;

	let value = "";

	$: charCount = value.length;
</script>

<label class="sr-only" for={id}>{label}</label>
<textarea
	class="w-full py-2.5 | bg-transparent outline-none text-white placeholder-zinc-500 resize-none"
	{name}
	{id}
	cols="10"
	rows="1"
	{maxlength}
	{placeholder}
	data-minimum-rows="1"
	on:input={handleExpandableArea}
	bind:value
	bind:this={element}
/>
