<script lang="ts">
	import type { PageData } from "./$types";
	import { CardUser, Tab, TabGroup, Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";
	import { page } from "$app/stores";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.query} - Twitter Search</title>
</svelte:head>

<div>
	<Header title="Search" />
	<TabGroup borderTop={false}>
		<Tab
			text="Top"
			action="/search"
			isActive={$page.url.searchParams.get("target") === null}
			isForm
		>
			<input type="hidden" name="query" value={data.query} />
		</Tab>
		<Tab
			text="People"
			action="/search"
			isActive={$page.url.searchParams.get("target") === "people"}
			isForm
		>
			<input type="hidden" name="query" value={data.query} />
			<input type="hidden" name="target" value="people" />
		</Tab>
	</TabGroup>
</div>
<Feed>
	{#if data.results.tweets}
		{#each data.results.tweets as tweet (tweet.id)}
			<Tweet {tweet} />
		{/each}
	{:else if data.results.people}
		<Feed class="px-8" title="Users">
			{#each data.results.people as user (user.id)}
				<CardUser {...user} isSmall={false} />
			{/each}
		</Feed>
	{/if}
</Feed>
