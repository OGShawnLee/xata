<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet, TweetLoading } from "$lib/components";
	import { Feed } from "$lib/layout";
	import { useInfiniteScrolling } from "$lib/hooks";

	export let data: PageData;

	const fetchMoreTweets = useInfiniteScrolling<TweetObject>({
		endpoint: "/",
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => fetchMoreTweets(data.feed.page)}
>
	{#each data.feed.records as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
