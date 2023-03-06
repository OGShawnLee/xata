<script lang="ts">
	import Context from "./Context";
	import Count from "./Count.svelte";
	import { page } from "$app/stores";
	import { tweetLikesDialog, tweetRetweetsDialog } from "$lib/state";

	const { id, user, likeCount, quoteCount, retweetCount, text } = Context.getContext();
	const likes = tweetLikesDialog.getLinkAction(user.displayName, id, "/likes");
	const retweets = tweetRetweetsDialog.getLinkAction(user.displayName, id, "/retweets");

	$: pathname = $page.url.pathname;
</script>

{#if likeCount || retweetCount || quoteCount}
	<div class="h-12 | flex items-center gap-12 | border-y-2 border-zinc-800">
		<Count count={retweetCount} href="{pathname}/retweets" word="Retweet" use={retweets} />
		<Count count={quoteCount} href="{pathname}/retweets/with_comments" word="Quote Tweet" />
		<Count count={likeCount} href="{pathname}/likes" word="Like" use={likes} />
	</div>
{/if}
