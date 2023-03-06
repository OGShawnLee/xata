<script>
	import { DialogTitle } from "malachite-ui";
	import {
		ButtonClose,
		ButtonWhite,
		CharCount,
		Dialog,
		TweetHeader,
		TweetQuote,
		TextArea
	} from "$lib/components";
	import { composeDialog, currentUser } from "$lib/state";
	import { enhance } from "$app/forms";

	let charCount = 0;

	$: event = $composeDialog.event;
	$: disabled = charCount === 0;
	$: quotedTweet = $composeDialog.data.quoteTweet;
</script>

<Dialog bind:open={$composeDialog.open} let:close>
	<form class="grid gap-4.5" action="/home?/quote-tweet" method="post" use:enhance>
		<header class="px-8 pb-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<ButtonClose {close} />
			<DialogTitle class="text-xl text-white font-medium">Compose</DialogTitle>
			<div class="ml-auto | flex items-center gap-3">
				<CharCount {charCount} />
				<ButtonWhite {disabled} type="submit">Quote Tweet</ButtonWhite>
			</div>
		</header>
		<div class="px-8">
			{#if event === "QUOTE" && quotedTweet}
				<TweetHeader displayName={$currentUser?.displayName} name={$currentUser?.name} />
				<TextArea
					bind:charCount
					placeholder="What do you think about this tweet?"
					id="tweet-text"
					label="Tweet"
				/>
				<TweetQuote tweet={quotedTweet} />
				<input type="hidden" name="tweet-id" value={quotedTweet.id} />
			{/if}
		</div>
	</form>
</Dialog>
