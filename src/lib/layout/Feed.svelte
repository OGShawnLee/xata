<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import Intersection from "svelte-intersection-observer";

	let className: string | undefined = undefined;

	export { className as class };
	export let more = false;
	export let loadingComponent: typeof SvelteComponent | undefined = undefined;
	export let title = "Tweets";

	let element: HTMLElement;
</script>

<section class={className}>
	<h2 class="sr-only">{title}</h2>
	<div class="grid gap-4">
		<slot />
	</div>
	<Intersection {element} on:intersect let:intersecting>
		<div bind:this={element} />
		{#if intersecting && more}
			<div class="mt-4">
				<svelte:component this={loadingComponent} />
			</div>
		{/if}
	</Intersection>
</section>
