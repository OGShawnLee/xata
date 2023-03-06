<script lang="ts">
	import Header from "./Header.svelte";

	export let tweet: QuoteTweet;
</script>

<article class="p-4 | border-2 border-zinc-800 rounded-2xl">
	<div class="grid gap-1.25">
		<Header isQuote {...tweet.user} createdAt={tweet.createdAt} />
		<p class="text-sm whitespace-pre-line">{tweet.text}</p>
	</div>
</article>
