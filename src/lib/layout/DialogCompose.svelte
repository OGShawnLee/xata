<script lang="ts" context="module">
	function getAction(
		event: "NONE" | "QUOTE" | "REPLY",
		user: UserObject | undefined,
		id: string | undefined
	) {
		if (event === "QUOTE") return "/home?/quote-tweet";
		return user ? `/${user.displayName}/status/${id}?/reply` : undefined;
	}
</script>

<script lang="ts">
	import { DialogTitle } from "malachite-ui";
	import { ButtonClose, ButtonWhite, CharCount, Dialog, TextArea } from "$lib/components";
	import { Tweet, TweetHeader, TweetQuote } from "$lib/components";
	import { composeDialog, currentUser } from "$lib/state";
	import { enhance } from "$app/forms";

	let charCount = 0;

	$: ({ data, event } = $composeDialog);
	$: action = getAction(event, data.replyTweet?.user, data.replyTweet?.id);
	$: disabled = charCount === 0;
</script>

<Dialog bind:open={$composeDialog.open} let:close>
	<form class="grid gap-4.5" {action} method="post" use:enhance>
		<header class="px-8 pb-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<ButtonClose {close} />
			<DialogTitle class="text-xl text-white font-medium">Compose</DialogTitle>
			<div class="ml-auto | flex items-center gap-3">
				<CharCount {charCount} />
				<ButtonWhite {disabled} type="submit">
					{event === "QUOTE" ? "Quote Tweet" : "Reply"}
				</ButtonWhite>
			</div>
		</header>
		<div class="px-8">
			{#if event === "QUOTE" && data.quoteTweet}
				<TweetHeader displayName={$currentUser?.displayName} name={$currentUser?.name} />
				<TextArea
					bind:charCount
					placeholder="What do you think about this tweet?"
					id="tweet-text"
					label="Tweet"
				/>
				<TweetQuote tweet={data.quoteTweet} />
				<input type="hidden" name="tweet-id" value={data.quoteTweet.id} />
			{:else if event === "REPLY" && data.replyTweet}
				<Tweet tweet={data.replyTweet} hasPadding={false} isReplying />
				<TweetHeader
					displayName={$currentUser?.displayName}
					name={$currentUser?.name}
					isLink={false}
				/>
				<TextArea bind:charCount placeholder="What will you reply?" id="tweet-text" label="Tweet" />
				<input type="hidden" name="tweet-id" value={data.replyTweet.id} />
			{/if}
		</div>
	</form>
</Dialog>
