<script lang="ts">
	import type { Quote } from '@types';
	import Header from "./Header.svelte";
	import Text from "./Text.svelte";

	export let tweet: Quote;
	export let isLink = false;
</script>

{#if isLink}
	<a class="mt-1.25" href="/{tweet.user.displayName}/status/{tweet.id}" title="View Quoted Tweet">
		<article class="p-4 | border-2 border-zinc-800 rounded-2xl">
			<div class="grid gap-1.25">
				<Header isLink={false} {...tweet.user} createdAt={tweet.createdAt} />
				<Text text={tweet.text}/>
			</div>
		</article>
	</a>
{:else}
	<article class="p-4 | border-2 border-zinc-800 rounded-2xl">
		<div class="grid gap-1.25">
			<Header isLink={false} {...tweet.user} createdAt={tweet.createdAt} />
			<Text text={tweet.text}/>
		</div>
	</article>
{/if}
