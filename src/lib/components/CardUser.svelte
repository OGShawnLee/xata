<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let name: Nullable<string>;
	export let displayName: Nullable<string>;
	export let description: Nullable<string>;
</script>

<article class="grid gap-0.75">
	<div class="flex items-baseline gap-3">
		<h3 class="text-white font-medium">{name}</h3>
		<a class="text-sm text-zinc-500 hover:underline focus:underline" href="/{displayName}">
			@{displayName}
		</a>
	</div>
	{#if description}
		<p class="text-sm">{description}</p>
	{/if}
</article>
