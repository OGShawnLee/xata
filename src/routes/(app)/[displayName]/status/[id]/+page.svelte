<script lang="ts">
	import type { PageData } from "./$types";
	import DialogLikes from "./DialogLikes.svelte";
	import DialogRetweets from "./DialogRetweets.svelte";
	import { TweetPage } from "$lib/components";
	import { Header } from "$lib/layout";
	import { clearString } from "malachite-ui/utils";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.tweet.user.name} on Twitter: "{clearString(data.tweet.text)}"</title>
</svelte:head>

<DialogLikes />
<DialogRetweets />

<Header title="Tweet" />
<TweetPage tweet={data.tweet} />
