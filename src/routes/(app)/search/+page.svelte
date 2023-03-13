<script lang="ts">
	import type { PageData } from "./$types";
	import { CardUser, Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.query} - Twitter Search</title>
</svelte:head>

<Header title="Search" />
<Feed>
	{#each data.results.tweets as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
<Feed class="px-8" title="Users">
	{#each data.results.users as user (user.id)}
		<CardUser {...user} isSmall={false} />
	{/each}
</Feed>
