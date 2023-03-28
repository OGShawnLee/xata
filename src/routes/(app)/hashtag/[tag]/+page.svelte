<script lang="ts">
	import { Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";

	export let data;
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
