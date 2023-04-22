<script lang="ts">
	import Context from "./Context";
	import { Count } from "$lib/components";
	import { page } from "$app/stores";
	import { tweetLikesDialog, tweetRetweetsDialog } from "$lib/state";

	const tweet = Context.getContext();

	$: likes = tweetLikesDialog.getLinkAction($tweet.user.displayName, $tweet.id, "/likes");
	$: pathname = $page.url.pathname;
	$: retweets = tweetRetweetsDialog.getLinkAction($tweet.user.displayName, $tweet.id, "/retweets");
</script>

{#if $tweet.likeCount || $tweet.retweetCount || $tweet.quoteCount}
	<div class="pb-2 flex items-center gap-12 | border-b-2 border-zinc-800">
		<Count count={$tweet.retweetCount} href="{pathname}/retweets" text="Retweet" use={retweets} />
		<Count count={$tweet.quoteCount} href="{pathname}/retweets/with_comments" text="Quote Tweet" />
		<Count count={$tweet.likeCount} href="{pathname}/likes" text="Like" use={likes} />
		<Count count={$tweet.bookmarkCount} text="Bookmark" />
	</div>
{/if}
