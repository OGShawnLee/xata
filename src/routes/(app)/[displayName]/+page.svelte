<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>{data.foundUser?.name} (@{data.foundUser?.displayName}) - Twitter</title>
</svelte:head>

<Feed>
	{#each data.tweets as { id, createdAt, text, user, likeCount, retweetCount, isLiked, isBookmarked } (id)}
		<Tweet
			{createdAt}
			{text}
			{id}
			displayName={user?.displayName}
			name={user?.name}
			{likeCount}
			{retweetCount}
			{isLiked}
			{isBookmarked}
		/>
	{/each}
</Feed>
