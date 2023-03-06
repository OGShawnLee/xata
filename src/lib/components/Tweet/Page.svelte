<script lang="ts">
	import { Bookmark, Like } from "./Button";
	import Context from "./Context";
	import Menu from "./Menu.svelte";
	import Header from "./Header.svelte";
	import Stats from "./Stats.svelte";

	export let tweet: TweetObject;

	Context.setContext(tweet);

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "medium" });
</script>

<div class="px-8 | grid gap-2.25">
	<Header displayName={tweet.user.displayName} name={tweet.user.name} big />
	<p>{tweet.text}</p>
	<time class="text-sm text-zinc-500" datetime={tweet.createdAt.toISOString()}>
		{formatter.format(tweet.createdAt)}
	</time>
	<Stats />
	<div class="flex items-center justify-around | pt-2.75">
		<Like />
		<Menu />
		<Bookmark />
	</div>
</div>
