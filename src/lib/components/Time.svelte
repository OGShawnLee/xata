<script lang="ts">
	import { getRelativeTime } from "$lib/utils";

	export let createdAt: Date | undefined;
</script>

{#if createdAt}
	<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
		{getRelativeTime(createdAt)}
	</time>
{/if}
