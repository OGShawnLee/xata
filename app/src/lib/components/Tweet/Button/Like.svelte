<script lang="ts" context="module">
	function getLikeAction(isBookmarkPage: boolean) {
		const path = "/home?/like-or-unlike";
		return isBookmarkPage ? path + "&redirect=/i/bookmarks" : path;
	}
</script>

<script lang="ts">
	import Context from "../Context";
	import Button from "./Button.svelte";
	import { Heart } from "lucide-svelte";
	import { page } from "$app/stores";

	export let counter = true;

	const tweet = Context.getContext();

	$: ({ id, likeCount, isLiked } = $tweet);

	$: action = getLikeAction(isBookmarkPage);
	$: count = counter ? likeCount : undefined;
	$: isBookmarkPage = $page.url.pathname.includes("i/bookmarks");
	$: label = isLiked ? "Unlike Tweet" : "Like Tweet";
</script>

<Button {action} {id} {label} icon={Heart} {count} fill={isLiked} />
