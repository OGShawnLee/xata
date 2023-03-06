<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>Tweets Quotes - Twitter</title>
</svelte:head>

<Header title="Tweet Quotes" />
<Feed>
	{#each data.quotes as quote (quote.id)}
		<Tweet tweet={quote} quoteOf={data.tweet} />
	{/each}
</Feed>
