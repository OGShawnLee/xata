<script lang="ts">
	import Context from "./Context";
	import { Pin, Repeat } from "lucide-svelte";

	export let isPinned = false;

	const tweet = Context.getContext();
</script>

{#if $tweet.retweetOf || isPinned}
	<div class="flex items-center gap-1 | text-zinc-500">
		<svelte:component this={isPinned ? Pin : Repeat} size={14} />
		<span class="text-xs" class:font-semibold={isPinned}>
			{#if isPinned}
				Pinned Tweet
			{:else}
				<a class="font-semibold hover:underline focus:underline" href="/{$tweet.user.displayName}">
					{$tweet.user.name}
				</a>
				retweeted
			{/if}
		</span>
	</div>
{/if}
