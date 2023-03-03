<script lang="ts">
	import Count from "./Count.svelte";

	export let likeCount: number;
	export let retweetCount: number;
</script>

{#if likeCount || retweetCount}
	<div class="h-12 | flex items-center gap-12 | border-y-2 border-zinc-800">
		<Count count={retweetCount} word="Retweet" />
		<Count count={likeCount} word="Like" />
	</div>
{/if}
