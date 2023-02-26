<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let title: Nullable<string> = undefined;
	export let displayName: Nullable<string> = undefined;
	export let createdAt: Nullable<Date> = undefined;
</script>

<header class="border-b-2 border-zinc-800 leading-3">
	<div class="px-8 pb-4">
		<h1 class="text-white text-2xl font-bold">{title}</h1>
		{#if displayName}
			<div class="flex items-baseline justify-between gap-3">
				<span class="text-sm text-zinc-500"> @{displayName} </span>
				{#if createdAt}
					{@const formatter = Intl.DateTimeFormat("en", { dateStyle: "full" })}
					<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
						Joined {formatter.format(createdAt)}
					</time>
				{/if}
			</div>
		{/if}
	</div>
</header>
