<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let createdAt: Date | undefined = undefined;
	export let displayName: Nullable<string>;
	export let name: Nullable<string>;
	export let big = false;

	$: as = big ? "h2" : "h3";
</script>

<header class="flex items-baseline justify-between">
	<div class="flex items-baseline gap-3">
		<svelte:element this={as} class="text-white font-medium" class:text-lg={big}>
			{name}
		</svelte:element>
		<a
			class="{big ? 'text-base' : 'text-sm'} text-zinc-500 hover:underline focus:underline"
			href="/{displayName}"
		>
			@{displayName}
		</a>
	</div>
	{#if createdAt}
		{@const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium" })}
		<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
			{formatter.format(createdAt)}
		</time>
	{/if}
</header>
