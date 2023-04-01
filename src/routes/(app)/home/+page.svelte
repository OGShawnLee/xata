<script lang="ts">
	import type { Tweet } from "@types";
	import { Tweet as TweetComponent, TweetLoading } from "$lib/components";
	import { Feed, Header, TweetTextArea } from "$lib/layout";
	import { useInfiniteScrolling } from "$lib/hooks";

	export let data;
	export let form;

	const fetchMoreTweets = useInfiniteScrolling<Tweet>({
		endpoint: "/home",
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<TweetTextArea value={form?.text?.value} />
<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => fetchMoreTweets(data.feed.page)}
>
	{#each data.feed.records as tweet (tweet.id)}
		<TweetComponent {tweet} />
	{/each}
</Feed>
