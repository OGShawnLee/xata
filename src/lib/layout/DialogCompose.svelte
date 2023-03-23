<script lang="ts" context="module">
	import type { User } from "@types";
	
	type Event = "NONE" | "COMPOSE" | "QUOTE" | "REPLY";

	function getAction(event: Event, user: User | undefined, id: string | undefined) {
		if (event === "COMPOSE") return "/home?/tweet";
		if (event === "QUOTE") return "/home?/quote-tweet";
		return user ? `/${user.displayName}/status/${id}?/reply` : undefined;
	}

	function getSubmitButtonText(event: Event) {
		if (event === "QUOTE") return "Quote Tweet";
		if (event === "REPLY") return "Reply";
		return "Tweet";
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
					{getSubmitButtonText(event)}
				</ButtonWhite>
			</div>
		</header>
		<div class="px-8">
			{#if event === "COMPOSE"}
				<TweetHeader
					displayName={$currentUser?.displayName}
					name={$currentUser?.name}
					isLink={false}
				/>
				<TextArea bind:charCount placeholder="What is happening?" id="tweet-text" label="Tweet" />
			{:else if event === "QUOTE" && data.quoteTweet}
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
