<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import Context from "./Context";
	import Badge from "./Badge.svelte";
	import Header from "./Header.svelte";
	import Quote from "./Quote.svelte";
	import { MenuRetweet, MenuShare } from "./Menu";
	import { ArrowRight } from "lucide-svelte";
	import { Bookmark, Like } from "./Button";
	import { currentUser } from "$lib/state";
	import { isNullish, isObject } from "malachite-ui/predicate";
	import { writable } from "svelte/store";

	export let tweet: TweetObject;
	export let quoteOf: QuoteTweetObject | undefined = undefined;
	export let padding = true;

	if (quoteOf) tweet.quoteOf = quoteOf;

	const state = Context.setContext(writable(tweet));
	$: state.set(tweet);

	$: retweetOf = tweet.retweetOf;
	$: user = tweet.user;

	$: finalQuoteOf = tweet.quoteOf ? tweet.quoteOf : tweet.retweetOf?.quoteOf;
	$: finalDisplayName = isObject(retweetOf) ? retweetOf.user.displayName : user.displayName;
	$: finalName = isObject(retweetOf) ? retweetOf.user.name : user.name;
	$: finalText = isObject(retweetOf) ? retweetOf.text : tweet.text;
	$: finalCreatedAt = isObject(retweetOf) ? retweetOf.createdAt : tweet.createdAt;
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="grid gap-1.25" class:px-8={padding}>
		{#if retweetOf}
			<Badge />
		{/if}
		<Header displayName={finalDisplayName} name={finalName} createdAt={finalCreatedAt} />
		<p class="whitespace-pre-line">{finalText}</p>
		{#if finalQuoteOf}
			<Quote tweet={finalQuoteOf} isLink />
		{/if}
		{#if $currentUser && isNullish(retweetOf)}
			<div class="flex items-center justify-between | pt-2.75">
				<Like />
				<MenuRetweet />
				<MenuShare />
				<a href="/{user.displayName}/status/{tweet.id}" title="View Tweet">
					<ArrowRight />
					<span class="sr-only"> View Tweet </span>
				</a>
			</div>
		{/if}
	</div>
</article>
