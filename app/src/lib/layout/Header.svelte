<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h1";
	export let title: Nullable<string> = undefined;
	export let displayName: Nullable<string> = undefined;
</script>

<header class="h-20 border-b-2 border-zinc-800">
	<div class="h-full px-8 | flex items-center justify-between">
		<div>
			<svelte:element this={as} class="text-white text-2xl font-bold">
				{title}
			</svelte:element>
			{#if displayName}
				<div class="flex items-baseline justify-between gap-3">
					<span class="text-sm text-zinc-500"> @{displayName} </span>
				</div>
			{/if}
		</div>
		<slot name="button" />
	</div>
</header>
