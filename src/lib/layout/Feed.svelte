<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import Intersection from "svelte-intersection-observer";

	export let more = false;
	export let loadingComponent: typeof SvelteComponent | undefined = undefined;
	export let title = "Tweets";

	let element: HTMLElement;
</script>

<section>
	<h2 class="sr-only">{title}</h2>
	<div class="grid gap-4">
		<slot />
	</div>
	<Intersection {element} on:intersect let:intersecting>
		<div bind:this={element} />
		{#if intersecting && more}
			<svelte:component this={loadingComponent} />
		{/if}
	</Intersection>
</section>
