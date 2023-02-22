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
	import { useListener } from "malachite-ui/hooks";

	export let error: string | undefined = undefined;
	export let icon: string | undefined = undefined;
	export let id: string;
	export let label = id;
	export let maxlength: number | undefined = undefined;
	export let minlength: number | undefined = undefined;
	export let name = id;
	export let placeholder: string | undefined = undefined;
	export let type = "text";
	export let value = "";

	$: charCount = value.length;

	function bind(element: HTMLInputElement) {
		return {
			destroy: useListener(element, "input", () => {
				value = element.value;
			})
		};
	}
</script>

<div class="w-full | grid gap-1.5">
	<div class="flex items-center justify-between">
		<label class="w-[fit-content] | capitalize" for={id}>{label}</label>
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
			{#if icon}
				<div class="w-12 min-w-12 h-12 | grid place-content-center | bg-zinc-700">
					<i class="bx {icon} text-2xl group-focus-within:text-white" />
				</div>
			{/if}
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
		</div>
		{#if error}
			<div class="flex items-center gap-1.5 | text-rose-400 ">
				<i class="bx bx-error" />
				<span class="text-xs font-roboto"> {error} </span>
			</div>
		{/if}
	</div>
</div>
