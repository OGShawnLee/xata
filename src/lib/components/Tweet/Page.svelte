<script lang="ts">
	import { Like, Reply } from "./Button";
	import Context from "./Context";
	import Header from "./Header.svelte";
	import ReplyLink from "./ReplyLink.svelte";
	import Quote from "./Quote.svelte";
	import Stats from "./Stats.svelte";
	import { MenuRetweet, MenuShare } from "./Menu";
	import { writable } from "svelte/store";

	export let tweet: TweetObject;

	const state = Context.setContext(writable(tweet));
	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "medium" });

	$: state.set(tweet);
</script>

<div class="border-b-2 border-zinc-800">
	<div class="px-8">
		<div class="grid gap-2.25">
			<Header displayName={tweet.user.displayName} name={tweet.user.name} big />
			<div class="grid gap-1.25">
				<ReplyLink />
				<p class="whitespace-pre-line">{tweet.text}</p>
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
