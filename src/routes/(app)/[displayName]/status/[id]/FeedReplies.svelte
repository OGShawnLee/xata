<script lang="ts">
	import { Tweet, TweetLoading } from "$lib/components";
	import { range } from "$lib/utils";

	let pendingReplies: Promise<TweetObject[]> | undefined;

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
			<Tweet tweet={reply} />
		{/each}
	{:catch}
		<span>Unable to load replies.</span>
	{/await}
{/if}
