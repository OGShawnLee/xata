<script lang="ts">
	import type { Tweet } from "@types";
	import { Tweet as TweetComponent, TweetLoading } from "$lib/components";
	import { Feed } from "$lib/layout";
	import { useInfiniteScrolling } from "$lib/hooks";
	import { page } from "$app/stores";

	export let data;

	$: fetchMoreUserTweets = useInfiniteScrolling<Tweet>({
		endpoint: $page.url.pathname,
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<svelte:head>
	<title>{data.foundUser?.name} (@{data.foundUser?.displayName}) - Twitter</title>
</svelte:head>

<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => fetchMoreUserTweets(data.feed.page)}>
	{#if data.pinnedTweet}
		<TweetComponent tweet={data.pinnedTweet} isPinned />
	{/if}
	{#each data.feed.records as tweet (tweet.id)}
		<TweetComponent {tweet} />
	{/each}
</Feed>
