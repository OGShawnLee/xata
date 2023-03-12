<script lang="ts">
	import Header from "./Header.svelte";

	export let tweet: QuoteTweetObject;
	export let isLink = false;
</script>

{#if isLink}
	<a class="mt-1.25" href="/{tweet.user.displayName}/status/{tweet.id}" title="View Quoted Tweet">
		<article class="p-4 | border-2 border-zinc-800 rounded-2xl">
			<div class="grid gap-1.25">
				<Header link={false} {...tweet.user} createdAt={tweet.createdAt} />
				<p class="whitespace-pre-line">{tweet.text}</p>
			</div>
		</article>
	</a>
{:else}
	<article class="p-4 | border-2 border-zinc-800 rounded-2xl">
		<div class="grid gap-1.25">
			<Header link={false} {...tweet.user} createdAt={tweet.createdAt} />
			<p class="whitespace-pre-line">{tweet.text}</p>
		</div>
	</article>
{/if}
