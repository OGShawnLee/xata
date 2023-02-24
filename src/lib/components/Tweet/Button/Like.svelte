<script lang="ts" context="module">
	function getLikeAction(isBookmarkPage: boolean) {
		const path = "/home?/like-tweet";
		return isBookmarkPage ? path + "&redirect=/i/bookmarks" : path;
	}
</script>

<script lang="ts">
	import Button from "./Button.svelte";
	import { Heart } from "lucide-svelte";
	import { page } from "$app/stores";

	export let id: string;
	export let likeCount = 0;
	export let isLiked: boolean;

	$: action = getLikeAction(isBookmarkPage);
	$: isBookmarkPage = $page.url.pathname.includes("i/bookmarks");
</script>

<Button {action} {id} label="Like Tweet" icon={Heart} count={likeCount} fill={isLiked} />
