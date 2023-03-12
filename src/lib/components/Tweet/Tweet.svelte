<script lang="ts">
	import Context from "./Context";
	import Badge from "./Badge.svelte";
	import Header from "./Header.svelte";
	import Quote from "./Quote.svelte";
	import { MenuRetweet, MenuShare } from "./Menu";
	import { Like, Reply } from "./Button";
	import { currentUser } from "$lib/state";
	import { isNullish } from "malachite-ui/predicate";
	import { writable } from "svelte/store";

	export let buttons = true;
	export let quoteOf: QuoteTweetObject | undefined = undefined;
	export let padding = true;
	export let replying = false;
	export let tweet: TweetObject;

	if (quoteOf) tweet.quoteOf = quoteOf;
	if (replying) buttons = false;

	const state = Context.setContext(writable(tweet));

	$: retweetOf = tweet.retweetOf;
	$: user = tweet.user;
	$: finalCreatedAt = retweetOf ? retweetOf.createdAt : tweet.createdAt;
	$: finalDisplayName = retweetOf ? retweetOf.user.displayName : user.displayName;
	$: finalId = retweetOf ? retweetOf.id : tweet.id;
	$: finalName = retweetOf ? retweetOf.user.name : user.name;
	$: finalQuoteOf = tweet.quoteOf ? tweet.quoteOf : tweet.retweetOf?.quoteOf;
	$: finalText = retweetOf ? retweetOf.text : tweet.text;
	$: state.set(tweet);
</script>

<article class={replying ? "pb-4" : "pb-4 border-b-2 border-zinc-800"}>
	<div class="grid gap-1.25" class:px-8={padding}>
		{#if retweetOf}
			<Badge />
		{/if}
		<Header
			displayName={finalDisplayName}
			name={finalName}
			createdAt={finalCreatedAt}
			link={!replying}
		/>
		{#if replying}
			<p class="whitespace-pre-line">{finalText}</p>
		{:else}
			<a href="/{finalDisplayName}/status/{finalId}" aria-label="View Tweet">
				<p class="whitespace-pre-line">{finalText}</p>
			</a>
		{/if}
		{#if finalQuoteOf}
			<Quote tweet={finalQuoteOf} isLink />
		{/if}
		{#if buttons && $currentUser && isNullish(retweetOf)}
			<div class="flex items-center justify-between | pt-2.75">
				<Reply />
				<Like />
				<MenuRetweet />
				<MenuShare />
			</div>
		{/if}
	</div>
</article>
