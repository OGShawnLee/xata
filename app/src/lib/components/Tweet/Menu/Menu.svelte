<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { Menu, MenuButton, MenuItems } from "malachite-ui";
	import { isNumber } from "malachite-ui/predicate";

	export let counter = true;
	export let count: number | undefined = undefined;
	export let label: string;
	export let icon: typeof SvelteComponent;
	export let iconClass = "";
	export let iconSize = 24;

	$: finalCount = counter ? count : undefined;
	$: finalIconClassName = iconClass
		? "group-focus:stroke-white " + iconClass
		: "group-focus:stroke-white";
</script>

<Menu class="relative" infinite>
	<MenuButton class="group | flex items-center gap-3" nofocus aria-label={label} title={label}>
		<svelte:component this={icon} class={finalIconClassName} size={iconSize} />
		{#if isNumber(finalCount)}
			<span class="text-sm"> {finalCount} </span>
		{/if}
	</MenuButton>
	<MenuItems
		class="absolute top-0 -right-3 w-70 z-10 | bg-zinc-800 rounded-xl shadow-lg overflow-hidden outline-none"
	>
		<slot />
	</MenuItems>
</Menu>
