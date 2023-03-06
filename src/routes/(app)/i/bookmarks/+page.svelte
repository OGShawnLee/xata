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
	{#each data.bookmarks as bookmark (bookmark.id)}
		<Tweet tweet={bookmark.tweet} />
	{/each}
</Feed>
