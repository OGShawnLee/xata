<script lang="ts">
	import { page } from "$app/stores";
	import type { SvelteComponent } from "svelte";

	export let href: string;
	export let text: string;
	export let icon: typeof SvelteComponent;

	$: isActive = $page.url.pathname.includes(href);
</script>

<a class="flex items-center gap-3" {href}>
	<svelte:component this={icon} class={isActive ? "stroke-white" : "stroke-zinc-300"} />
	<span
		class={isActive ? "text-white" : "text-zinc-300"}
		class:text-lg={isActive}
		class:font-bold={isActive}
	>
		{text}
	</span>
</a>
