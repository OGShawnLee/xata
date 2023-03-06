<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>Tweets liked by {data.foundUser?.name} (@{data.foundUser?.displayName}) - Twitter</title>
</svelte:head>

<Feed>
	{#each data.likes as like (like.id)}
		<Tweet tweet={like.tweet} />
	{/each}
</Feed>
