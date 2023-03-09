<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { Menu, MenuButton, MenuItems } from "malachite-ui";
	import { isNumber } from "malachite-ui/predicate";

	export let counter = true;
	export let count: number | undefined = undefined;
	export let label: string;
	export let icon: typeof SvelteComponent;
	export let size = "w-56";

	$: finalCount = counter ? count : undefined;
</script>

<Menu class="relative" infinite>
	<MenuButton class="group | flex items-center gap-3" aria-label={label} title={label}>
		<svelte:component this={icon} class="group-focus:stroke-white" />
		{#if isNumber(finalCount)}
			<span class="text-sm"> {finalCount} </span>
		{/if}
	</MenuButton>
	<MenuItems
		class="absolute top-0 -right-3 {size} | bg-zinc-800 rounded-md shadow-lg overflow-hidden outline-none"
	>
		<slot />
	</MenuItems>
</Menu>
