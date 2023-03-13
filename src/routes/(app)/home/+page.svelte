<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { Tweet, TweetLoading } from "$lib/components";
	import { Feed, Header, TweetTextArea } from "$lib/layout";
	import { useAwait } from "$lib/hooks";
	import { parse } from "devalue";

	export let data: PageData;
	export let form: ActionData;

	async function getMoreTweets(page: { cursor: string; more: boolean }) {
		if (!page.more) return;

		const next = await useAwait(async () => {
			const response = await fetch(`/home?cursor=${page.cursor}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
			const text = await response.text();
			return parse(text) as Paginated<TweetObject>;
		});

		if (next.failed) console.log(next.error);
		else {
			data.feed.page = next.data.page;
			data.feed.records = data.feed.records.concat(next.data.records);
		}
	}
</script>

<svelte:head>
	<title>Home - Twitter</title>
</svelte:head>

<Header title="Home" />
<TweetTextArea value={form?.text?.value} />
<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => getMoreTweets(data.feed.page)}
>
	{#each data.feed.records as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
