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
	{#each data.likes as { id, tweet, isBookmarked, isLiked } (id)}
		<Tweet
			createdAt={tweet?.createdAt}
			text={tweet?.text}
			{id}
			displayName={tweet?.user?.displayName}
			name={tweet?.user?.name}
			likeCount={tweet?.likeCount}
			{isBookmarked}
			{isLiked}
		/>
	{/each}
</Feed>
