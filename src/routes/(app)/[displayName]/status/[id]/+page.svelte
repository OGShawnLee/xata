<script lang="ts">
	import type { PageData } from "./$types";
	import Dialog from "./Dialog.svelte";
	import { TweetPage } from "$lib/components";
	import { Header } from "$lib/layout";
	import { clearString } from "malachite-ui/utils";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.tweet.user.name} on Twitter: "{clearString(data.tweet.text)}"</title>
</svelte:head>

<Dialog />
<Header title="Tweet" />
<TweetPage tweet={data.tweet} />
