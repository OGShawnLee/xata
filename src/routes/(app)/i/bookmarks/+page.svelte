<script lang="ts">
	import type { Tweet } from "@types";
	import DialogNewFolder from "./DialogNewFolder.svelte";
	import { Tweet as TweetComponent, TweetLoading } from "$lib/components";
	import { Feed, Header } from "$lib/layout";
	import { FolderPlus } from "lucide-svelte";
	import { useSwitch } from "malachite-ui/hooks";
	import { useInfiniteScrolling } from "$lib/hooks";

	export let data;

	const open = useSwitch(false);
	let description = "";
	let name = "";

	const fetchMoreBookmarks = useInfiniteScrolling<Tweet>({
		endpoint: "/i/bookmarks",
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<svelte:head>
	<title>Bookmarks - Twitter</title>
</svelte:head>

<DialogNewFolder bind:open={$open} bind:description bind:name />

<Header title="Bookmarks" displayName={data.user?.displayName}>
	<button
		slot="button"
		on:click={open.toggle}
		aria-label="Create a Bookmark Folder"
		title="Create a Bookmark Folder"
	>
		<FolderPlus class="hover:stroke-white" />
	</button>
</Header>
<Feed
	loadingComponent={TweetLoading}
	more={data.feed.page.more}
	on:intersect={() => fetchMoreBookmarks(data.feed.page)}
>
	{#each data.feed.records as bookmark (bookmark.id)}
		<TweetComponent tweet={bookmark} />
	{/each}
</Feed>
