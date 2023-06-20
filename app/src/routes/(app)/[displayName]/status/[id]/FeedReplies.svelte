<script lang="ts">
	import type { Tweet } from "@types";
	import { Tweet as TweetComponent, TweetLoading } from "$lib/components";
	import { range } from "$lib/utils";

	let pendingReplies: Promise<Tweet[]> | undefined;

	export { pendingReplies as replies };
	export let replyCount: number;
</script>

{#if pendingReplies}
	{#await pendingReplies}
		{#if replyCount > 6}
			{#each range(6) as index (index)}
				<TweetLoading />
			{/each}
		{:else}
			{#each range(replyCount) as index (index)}
				<TweetLoading />
			{/each}
		{/if}
	{:then replies}
		{#each replies as reply (reply.id)}
			<TweetComponent tweet={reply} />
		{/each}
	{:catch}
		<span>Unable to load replies.</span>
	{/await}
{/if}
