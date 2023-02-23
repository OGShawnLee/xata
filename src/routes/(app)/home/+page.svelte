<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Header, TweetTextArea } from "$lib/layout";

	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Home - Twitter</title>
</svelte:head>

<Header title="Home" />
<TweetTextArea value={form?.text?.value} />
<section>
	<h2 class="sr-only">Tweets</h2>
	<div class="grid gap-4">
		{#each data.tweets as { id, createdAt, text, user } (id)}
				<Tweet {createdAt} {text} displayName={user?.displayName} name={user?.name} />
		{/each}
	</div>
</section>
