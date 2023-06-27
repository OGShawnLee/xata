<script lang="ts">
	import { getRelativeTime } from "$lib/utils";

	export let createdAt: Date | undefined;
	export let isMessage = false;
	export let isCurrentUser = false;
</script>

{#if createdAt}
	{#if isMessage}
		{@const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" })}
		<time
			class="{isCurrentUser ? 'ml-auto' : 'mr-auto'} text-xs text-zinc-500"
			datetime={createdAt.toISOString()}
		>
			{formatter.format(createdAt)} ·
			{getRelativeTime(createdAt)}
		</time>
	{:else}
		<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
			{getRelativeTime(createdAt)}
		</time>
	{/if}
{/if}
