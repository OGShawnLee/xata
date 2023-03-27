<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>#{data.hashtag} - Twitter</title>
</svelte:head>

<Header title="Hashtag" />
<Feed title="Tweets">
	{#each data.feed.records as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
