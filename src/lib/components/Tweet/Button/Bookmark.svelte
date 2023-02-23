<script lang="ts" context="module">
	function getBookmarkAction(isBookmarkPage: boolean) {
		const path = "/home?/bookmark-or-unbookmark";
		return isBookmarkPage ? path + "&redirect=/i/bookmarks" : path;
	}
</script>

<script lang="ts">
	import Button from "./Button.svelte";
	import { BookmarkMinus, BookmarkPlus } from "lucide-svelte";
	import { page } from "$app/stores";

	export let id: string;
	export let isBookmarked: boolean;

	$: action = getBookmarkAction(isBookmarkPage);
	$: icon = isBookmarked ? BookmarkMinus : BookmarkPlus;
	$: isBookmarkPage = $page.url.pathname.includes("i/bookmarks");
	$: label = isBookmarked ? "Unbookmark Tweet" : "Bookmark Tweet";
</script>

<Button {action} {id} {label} {icon} />
