<script lang="ts" context="module">
	function getLikeAction(isBookmarkPage: boolean, isLiked: boolean) {
		const path = isLiked ? "/home?/unlike-tweet" : "/home?/like-tweet";
		return isBookmarkPage ? path + "&redirect=/i/bookmarks" : path;
	}
</script>

<script lang="ts">
	import Context from "../Context";
	import Button from "./Button.svelte";
	import { Heart } from "lucide-svelte";
	import { page } from "$app/stores";

	const tweet = Context.getContext();

	$: ({ id, likeCount, isLiked } = $tweet);

	$: action = getLikeAction(isBookmarkPage, isLiked);
	$: isBookmarkPage = $page.url.pathname.includes("i/bookmarks");
	$: label = isLiked ? "Unlike Tweet" : "Like Tweet";
</script>

<Button {action} {id} {label} icon={Heart} count={likeCount} fill={isLiked} />
