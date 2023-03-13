<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.foundUser?.name} (@{data.foundUser?.displayName}) - Twitter</title>
</svelte:head>

<Feed>
	{#if data.pinnedTweet}
		<Tweet tweet={data.pinnedTweet} isPinned />
	{/if}
	{#each data.tweets as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
