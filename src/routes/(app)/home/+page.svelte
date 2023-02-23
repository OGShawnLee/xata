<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { Header, TweetTextArea } from "$lib/layout";

	export let form: ActionData;
</script>

<svelte:head>
	<title>Home - Twitter</title>
</svelte:head>

<Header title="Home" />
<TweetTextArea value={form?.text?.value} />
