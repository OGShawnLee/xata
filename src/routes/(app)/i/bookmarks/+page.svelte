<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";

	export let data: PageData;
</script>

<svelte:head>
	<title>Bookmarks - Twitter</title>
</svelte:head>

<Header title="Bookmarks" displayName={data.user?.displayName} />
<Feed>
	{#each data.bookmarks as { id, tweet } (id)}
		<Tweet
			createdAt={tweet?.createdAt}
			text={tweet?.text}
			id={tweet?.id}
			displayName={tweet?.user?.displayName}
			name={tweet?.user?.name}
			isBookmarked
			isLiked={tweet.isLiked}
			likeCount={tweet?.likeCount}
		/>
	{/each}
</Feed>
