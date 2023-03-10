<script lang="ts">
	import type { PageData } from "./$types";
	import DialogLikes from "./DialogLikes.svelte";
	import DialogRetweets from "./DialogRetweets.svelte";
	import TextAreaReply from "./TextAreaReply.svelte";
	import { Tweet, TweetPage } from "$lib/components";
	import { Header } from "$lib/layout";
	import { clearString } from "malachite-ui/utils";
	import { layout } from "$lib/state";
	import { onDestroy } from "svelte";

	export let data: PageData;

	$: {
		const relevantPeople = [data.tweet.user];
		if (data.tweet.quoteOf) relevantPeople.push(data.tweet.quoteOf.user);
		layout.set("RELEVANT-PEOPLE", relevantPeople);
	}

	onDestroy(() => layout.set("NONE", undefined));
</script>

<svelte:head>
	<title>{data.tweet.user.name} on Twitter: "{clearString(data.tweet.text)}"</title>
</svelte:head>

<DialogLikes />
<DialogRetweets />

<Header title="Tweet" />
<TweetPage tweet={data.tweet} />
<TextAreaReply hasBottomBorder={data.tweet.replyCount > 0} />
{#await data.streamed.replies}
	<span>Loading Replies...</span>
{:then replies}
	{#each replies as reply (reply.id)}
		<Tweet tweet={reply} />
	{/each}
{:catch error}
	<span>Unable to load replies.</span>
{/await}
