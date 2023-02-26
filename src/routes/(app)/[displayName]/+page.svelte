<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.foundUser.name} (@{data.foundUser.displayName}) - Twitter</title>
</svelte:head>

<Header
	title={data.foundUser.name}
	displayName={data.foundUser.displayName}
	createdAt={data.foundUser.createdAt}
/>
<Feed>
	{#each data.tweets as { id, createdAt, text, user, likeCount, isLiked, isBookmarked } (id)}
		<Tweet
			{createdAt}
			{text}
			{id}
			displayName={user?.displayName}
			name={user?.name}
			{likeCount}
			{isLiked}
			{isBookmarked}
		/>
	{/each}
</Feed>
