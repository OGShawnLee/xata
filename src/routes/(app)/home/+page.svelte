<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed, Header, TweetTextArea } from "$lib/layout";

	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Home - Twitter</title>
</svelte:head>

<Header title="Home" />
<TweetTextArea value={form?.text?.value} />
<Feed>
	{#each data.tweets as { id, createdAt, text, user } (id)}
		<Tweet {createdAt} {text} {id} displayName={user?.displayName} name={user?.name} />
	{/each}
</Feed>
