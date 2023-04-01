<script lang="ts">
	import { Tweet as TweetComponent, TweetLoading } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data;
</script>

<h1 class="sr-only">Following Feed</h1>

<Feed>
	{#each data.feed as tweet (tweet.id)}
		<TweetComponent {tweet} />
	{:else}
		<div class="mt-12 px-8">
			<p class="text-sm text-center text-zinc-400">Nothing to show here.</p>
			<p class="text-sm text-center text-zinc-400">
				Once you follow someone their new tweets will show here.
			</p>
		</div>
	{/each}
</Feed>
