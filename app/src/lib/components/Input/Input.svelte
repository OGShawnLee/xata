<script lang="ts" context="module">
	import { isAround, isNumber } from "malachite-ui/predicate";

	function getPercentage(amount: number, max: number) {
		return (amount / max) * 100;
	}

	function getCharCountColour(charCount: number, min: number, max: number) {
		if (isAround(charCount, { min: 0, max: min })) return "text-rose-400";
		const percentage = getPercentage(charCount, max);
		if (isAround(percentage, { min: 0, max: 50 })) return "text-lime-400";
		if (isAround(percentage, { min: 50, max: 80 })) return "text-orange-400";
		return "text-rose-400";
	}
</script>

<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import type { HTMLExpandableTextArea } from "$lib/actions";
	import { useListener } from "malachite-ui/hooks";
	import { handleExpandableArea } from "$lib/actions";

	export let error: string | undefined = undefined;
	export let icon: typeof SvelteComponent | undefined = undefined;
	export let id: string;
	export let label = id;
	export let nolabel = false;
	export let maxlength: number | undefined = undefined;
	export let minlength: number | undefined = 0;
	export let name = id;
	export let placeholder: string | undefined = undefined;
	export let type = "text";
	export let value = "";

	$: charCount = value?.length || 0;

	function bind(element: HTMLInputElement | HTMLTextAreaElement) {
		return {
			destroy: useListener(element, "input", () => {
				value = element.value;
			})
		};
	}

	function onTextAreaMount(element: HTMLTextAreaElement) {
		handleExpandableArea.bind(element as HTMLExpandableTextArea)();
	}
</script>

<div class="w-full | grid gap-1.5">
	<div class="flex items-center justify-between">
		<label class="w-[fit-content] | capitalize" class:hidden={nolabel} for={id}>{label}</label>
		{#if isNumber(maxlength) && isNumber(minlength)}
			<div class="text-sm font-victor">
				<span class="font-medium {getCharCountColour(charCount, minlength, maxlength)}">
					{charCount}
				</span>
				<span> / </span>
				<span class="font-bold"> {maxlength} </span>
			</div>
		{/if}
	</div>
	<div class="group grid gap-1">
		<div
			class="min-h-10 | flex | bg-zinc-800 rounded-xl overflow-hidden focus-within:(ring-2 ring-white)"
		>
			{#if icon && type !== "textarea"}
				<div class="w-12 min-w-12 h-12 | grid place-content-center | bg-zinc-700">
					<svelte:component this={icon} class="group-focus-within:stroke-white" />
				</div>
			{/if}
			{#if type === "textarea"}
				<textarea
					class="w-full py-2.5 px-3 | bg-transparent outline-none placeholder-zinc-400 focus:text-white"
					{id}
					{name}
					{placeholder}
					{maxlength}
					{minlength}
					cols="10"
					rows="1"
					data-minimum-rows="1"
					use:bind
					on:input={handleExpandableArea}
					use:onTextAreaMount>{value}</textarea
				>
			{:else}
				<input
					class="w-full py-2.5 px-3 | bg-transparent outline-none placeholder-zinc-400 focus:text-white"
					{type}
					{id}
					{name}
					{placeholder}
					{maxlength}
					{minlength}
					{value}
					use:bind
				/>
			{/if}
		</div>
		{#if error}
			<div class="flex items-center gap-1.5 | text-rose-400">
				<i class="bx bx-error" />
				<span class="text-xs font-roboto"> {error} </span>
			</div>
		{/if}
	</div>
</div>
