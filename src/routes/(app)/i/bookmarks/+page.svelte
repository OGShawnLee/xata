<script lang="ts">
	import type { PageData } from "./$types";
	import DialogNewFolder  from "./DialogNewFolder.svelte";
	import { Tweet } from "$lib/components";
	import { Feed, Header } from "$lib/layout";
	import { FolderPlus } from "lucide-svelte";
	import { useSwitch } from 'malachite-ui/hooks'

	export let data: PageData;

	const open = useSwitch(false)
	let description = ""
	let name = ""
</script>

<svelte:head>
	<title>Bookmarks - Twitter</title>
</svelte:head>

<DialogNewFolder bind:open={$open} bind:description bind:name/>

<Header title="Bookmarks" displayName={data.user?.displayName}>
	<button slot="button" on:click={open.toggle} aria-label="Create a Bookmark Folder" title="Create a Bookmark Folder">
		<FolderPlus class="hover:stroke-white" />
	</button>
</Header>
<Feed>
	{#each data.bookmarks as bookmark (bookmark.id)}
		<Tweet tweet={bookmark.tweet} />
	{/each}
</Feed>
