<script lang="ts">
	import Context from "./Context";
	import Count from "./Count.svelte";
	import { page } from "$app/stores";
	import { tweetLikesDialog, tweetRetweetsDialog } from "$lib/state";

	const tweet = Context.getContext();

	$: likes = tweetLikesDialog.getLinkAction($tweet.user.displayName, $tweet.id, "/likes");
	$: retweets = tweetRetweetsDialog.getLinkAction($tweet.user.displayName, $tweet.id, "/retweets");

	$: pathname = $page.url.pathname;
</script>

{#if $tweet.likeCount || $tweet.retweetCount || $tweet.quoteCount}
	<div class="pb-2 flex items-center gap-12 | border-b-2 border-zinc-800">
		<Count count={$tweet.retweetCount} href="{pathname}/retweets" word="Retweet" use={retweets} />
		<Count count={$tweet.quoteCount} href="{pathname}/retweets/with_comments" word="Quote Tweet" />
		<Count count={$tweet.likeCount} href="{pathname}/likes" word="Like" use={likes} />
		<Count count={$tweet.bookmarkCount} word="Bookmark" />
	</div>
{/if}
