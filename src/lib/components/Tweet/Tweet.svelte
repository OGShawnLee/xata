<script lang="ts">
	import type { Quote, Tweet } from "@types";
	import Context from "./Context";
	import Badge from "./Badge.svelte";
	import Header from "./Header.svelte";
	import ReplyLink from "./ReplyLink.svelte";
	import QuoteComponent from "./Quote.svelte";
	import Text from "./Text.svelte";
	import { MenuRetweet, MenuShare } from "./Menu";
	import { Like, Reply } from "./Button";
	import { currentUser } from "$lib/state";
	import { isNullish, isObject } from "malachite-ui/predicate";
	import { writable } from "svelte/store";

	export let hasButtons = true;
	export let hasPadding = true;
	export let isPinned = false;
	export let isReplying = false;
	export let quoteOf: Quote | undefined = undefined;
	export let tweet: Tweet;

	if (quoteOf) tweet.quoteOf = quoteOf;
	if (isReplying) hasButtons = false;

	const state = Context.setContext(writable(tweet));

	$: retweetOf = tweet.retweetOf;
	$: user = tweet.user;
	$: finalCreatedAt = retweetOf ? retweetOf.createdAt : tweet.createdAt;
	$: finalDisplayName = retweetOf ? retweetOf.user.displayName : user.displayName;
	$: finalName = retweetOf ? retweetOf.user.name : user.name;
	$: finalQuoteOf = tweet.quoteOf ? tweet.quoteOf : tweet.retweetOf?.quoteOf;
	$: state.set(tweet);
</script>

{#if isObject(tweet.replyOf, ["text"])}
	<svelte:self tweet={tweet.replyOf} />
{/if}
<article class={isReplying ? "pb-4" : "pb-4 border-b-2 border-zinc-800"}>
	<div class="grid gap-1.25" class:px-8={hasPadding}>
		<Badge {isPinned} />
		<Header
			displayName={finalDisplayName}
			name={finalName}
			createdAt={finalCreatedAt}
			isLink={!isReplying}
			{isPinned}
		/>
		<ReplyLink />
		<Text
			displayName={finalDisplayName}
			id={retweetOf ? retweetOf.id : tweet.id}
			{isReplying}
			text={retweetOf ? retweetOf.text : tweet.text}
		/>
		{#if finalQuoteOf}
			<QuoteComponent tweet={finalQuoteOf} isLink />
		{/if}
		{#if hasButtons && $currentUser && isNullish(retweetOf)}
			<div class="flex items-center justify-between | pt-2.75">
				<Reply />
				<Like />
				<MenuRetweet />
				<MenuShare />
			</div>
		{/if}
	</div>
</article>
