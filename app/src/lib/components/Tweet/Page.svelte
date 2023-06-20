<script lang="ts">
	import type { Tweet } from "@types";
	import Context from "./Context";
	import Header from "./Header.svelte";
	import ReplyLink from "./ReplyLink.svelte";
	import Quote from "./Quote.svelte";
	import Stats from "./Stats.svelte";
	import Text from "./Text.svelte";
	import TweetComponent from "./Tweet.svelte";
	import { Like, Reply } from "./Button";
	import { MenuRetweet, MenuShare } from "./Menu";
	import { writable } from "svelte/store";
	import { isObject } from "malachite-ui/predicate";

	export let tweet: Tweet;

	const state = Context.setContext(writable(tweet));
	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "medium" });

	$: state.set(tweet);
</script>

<div class="grid gap-8 | border-b-2 border-zinc-800">
	{#if isObject(tweet.replyOf, ["text"])}
		<TweetComponent tweet={tweet.replyOf} />
	{/if}
	<div class="px-8">
		<div class="grid gap-2.25">
			<Header displayName={tweet.user.displayName} name={tweet.user.name} big />
			<div class="grid gap-1.25">
				<ReplyLink />
				<Text text={tweet.text} />
			</div>
			{#if tweet.quoteOf}
				<Quote tweet={tweet.quoteOf} isLink />
			{/if}
			<time
				class="pb-2 | border-b-2 border-zinc-800 text-sm text-zinc-500"
				datetime={tweet.createdAt.toISOString()}
			>
				{formatter.format(tweet.createdAt)}
			</time>
			<Stats />
		</div>
		<div class="py-4 | flex items-center justify-around">
			<Reply counter={false} />
			<Like counter={false} />
			<MenuRetweet counter={false} />
			<MenuShare counter={false} />
		</div>
	</div>
</div>
