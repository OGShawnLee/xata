<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { Time } from "$lib/components";
	import { getRelativeTime } from "$lib/utils";

	export let createdAt: Date | undefined = undefined;
	export let displayName: Nullable<string>;
	export let name: Nullable<string>;
	export let big = false;
	export let link = true;

	$: as = big ? "h2" : "h3";
</script>

<header class="flex items-baseline justify-between">
	<div class="flex items-baseline gap-3">
		<svelte:element this={as} class="text-white font-medium" class:text-lg={big}>
			{name}
		</svelte:element>
		{#if link}
			<a
				class="{big ? 'text-base' : 'text-sm'} text-zinc-500 hover:underline focus:underline"
				href="/{displayName}"
			>
				@{displayName}
			</a>
		{:else}
			<span class="text-sm text-zinc-500"> @{displayName} </span>
		{/if}
	</div>
	<Time {createdAt} />
</header>
