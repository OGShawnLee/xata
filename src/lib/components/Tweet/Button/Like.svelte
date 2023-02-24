<script lang="ts" context="module">
	function getLikeAction(isBookmarkPage: boolean, isLiked: boolean) {
		const path = isLiked ? "/home?/unlike-tweet" : "/home?/like-tweet";
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

	$: action = getLikeAction(isBookmarkPage, isLiked);
	$: isBookmarkPage = $page.url.pathname.includes("i/bookmarks");
	$: label = isLiked ? "Unlike Tweet" : "Like Tweet";
</script>

<Button {action} {id} {label} icon={Heart} count={likeCount} fill={isLiked} />
