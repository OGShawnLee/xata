<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { page } from "$app/stores";

	export let as: "a" | "button" = "a"
	export let href: string | undefined = undefined;
	export let text: string;
	export let icon: typeof SvelteComponent;

	$: isActive = $page.url.pathname.includes(href);
</script>

<svelte:element class="h-6 | flex items-center gap-3 | cursor-pointer" this={as} {href} on:click>
	<svelte:component this={icon} class={isActive ? "stroke-white" : "stroke-zinc-300"} />
	<span
		class="{isActive ? "text-white" : "text-zinc-300"}"
		class:text-lg={isActive}
		class:font-bold={isActive}
	>
		{text}
	</span>
</svelte:element>
