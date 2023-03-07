<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import Context from "./Context";
	import Badge from "./Badge.svelte";
	import Header from "./Header.svelte";
	import Menu from "./Menu.svelte";
	import Quote from "./Quote.svelte";
	import { ArrowRight } from "lucide-svelte";
	import { Bookmark, Like } from "./Button";
	import { currentUser } from "$lib/state";
	import { isNullish, isObject } from "malachite-ui/predicate";
	import { writable } from "svelte/store";

	export let tweet: TweetObject;
	export let quoteOf: QuoteTweetObject | undefined = undefined;

	if (quoteOf) tweet.quoteOf = quoteOf;

	const state = Context.setContext(writable(tweet));
	$: state.set(tweet);

	$: retweetOf = tweet.retweetOf;
	$: user = tweet.user;

	$: finalDisplayName = isObject(retweetOf) ? retweetOf.user.displayName : user.displayName;
	$: finalName = isObject(retweetOf) ? retweetOf.user.name : user.name;
	$: finalText = isObject(retweetOf) ? retweetOf.text : tweet.text;
	$: finalCreatedAt = isObject(retweetOf) ? retweetOf.createdAt : tweet.createdAt;
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="px-8 | grid gap-1.25">
		{#if retweetOf}
			<Badge />
		{/if}
		<Header displayName={finalDisplayName} name={finalName} createdAt={finalCreatedAt} />
		<p class="whitespace-pre-line">{finalText}</p>
		{#if tweet.quoteOf}
			<Quote tweet={tweet.quoteOf} isLink />
		{/if}
		{#if $currentUser && isNullish(retweetOf)}
			<div class="flex items-center justify-between | pt-2.75">
				<Like />
				<Menu />
				<Bookmark />
				<a href="/{user.displayName}/status/{tweet.id}" title="View Tweet">
					<ArrowRight />
					<span class="sr-only"> View Tweet </span>
				</a>
			</div>
		{/if}
	</div>
</article>
