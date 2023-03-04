<script lang="ts">
	import Context from "./Context";
	import Count from "./Count.svelte";
	import { page } from "$app/stores";
	import { tweetLikesDialog } from "$lib/state";

	const { id, user, likeCount, retweetCount } = Context.getContext();
	const likes = tweetLikesDialog.getLinkAction(user.displayName, id);

	$: pathname = $page.url.pathname;
</script>

{#if likeCount || retweetCount}
	<div class="h-12 | flex items-center gap-12 | border-y-2 border-zinc-800">
		<Count count={retweetCount} word="Retweet" />
		<Count count={likeCount} href="{pathname}/likes" word="Like" use={likes} />
	</div>
{/if}
