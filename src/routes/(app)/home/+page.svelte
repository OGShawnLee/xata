<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { Tweet, TweetLoading } from "$lib/components";
	import { Feed, Header, TweetTextArea } from "$lib/layout";
	import { useInfiniteScrolling } from "$lib/hooks";

	export let data: PageData;
	export let form: ActionData;

	const fetchMoreTweets = useInfiniteScrolling<TweetObject>({
		endpoint: "/home",
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<svelte:head>
	<title>Home - Twitter</title>
</svelte:head>

<Header title="Home" />
<TweetTextArea value={form?.text?.value} />
<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => fetchMoreTweets(data.feed.page)}
>
	{#each data.feed.records as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
