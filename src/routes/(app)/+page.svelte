<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data: PageData;
</script>

<Feed>
	{#each data.tweets as { id, createdAt, text, user } (id)}
		<Tweet
			{createdAt}
			{text}
			{id}
			displayName={user?.displayName}
			name={user?.name}
			isBookmarked={false}
			isLiked={false}
		/>
	{/each}
</Feed>
