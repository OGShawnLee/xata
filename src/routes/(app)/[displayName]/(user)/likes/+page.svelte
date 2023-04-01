<script lang="ts">
	import type { Tweet } from "@types";
	import { Tweet as TweetComponent, TweetLoading } from "$lib/components";
	import { Feed } from "$lib/layout";
	import { useInfiniteScrolling } from "$lib/hooks";

	export let data;

	$: fetchMoreLikes = useInfiniteScrolling<Tweet>({
		endpoint: "/" + data.foundUser.displayName + "/likes",
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<svelte:head>
	<title>Tweets liked by {data.foundUser?.name} (@{data.foundUser?.displayName}) - Twitter</title>
</svelte:head>

<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => fetchMoreLikes(data.feed.page)}
>
	{#each data.feed.records as like (like.id)}
		<TweetComponent tweet={like} />
	{/each}
</Feed>
