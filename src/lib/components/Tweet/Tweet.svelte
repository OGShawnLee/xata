<script lang="ts">
	import Context from "./Context";
	import Badge from "./Badge.svelte";
	import Header from "./Header.svelte";
	import Quote from "./Quote.svelte";
	import { MenuRetweet, MenuShare } from "./Menu";
	import { ArrowRight } from "lucide-svelte";
	import { Like, Reply } from "./Button";
	import { currentUser } from "$lib/state";
	import { isNullish, isObject } from "malachite-ui/predicate";
	import { writable } from "svelte/store";

	export let tweet: TweetObject;
	export let quoteOf: QuoteTweetObject | undefined = undefined;
	export let padding = true;
	export let replying = false;
	export let buttons = true;

	if (quoteOf) tweet.quoteOf = quoteOf;
	if (replying) buttons = false;

	const state = Context.setContext(writable(tweet));

	$: retweetOf = tweet.retweetOf;
	$: user = tweet.user;
	$: finalQuoteOf = tweet.quoteOf ? tweet.quoteOf : tweet.retweetOf?.quoteOf;
	$: finalDisplayName = isObject(retweetOf) ? retweetOf.user.displayName : user.displayName;
	$: finalName = isObject(retweetOf) ? retweetOf.user.name : user.name;
	$: finalText = isObject(retweetOf) ? retweetOf.text : tweet.text;
	$: finalCreatedAt = isObject(retweetOf) ? retweetOf.createdAt : tweet.createdAt;
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
		<p class="whitespace-pre-line">{finalText}</p>
		{#if finalQuoteOf}
			<Quote tweet={finalQuoteOf} isLink />
		{/if}
		{#if buttons && $currentUser && isNullish(retweetOf)}
			<div class="flex items-center justify-between | pt-2.75">
				<Reply />
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
