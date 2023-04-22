<script>
	import Context from "./Context";

	const tweet = Context.getContext();
</script>

{#if $tweet.replyOf}
	<p class="text-sm text-zinc-500">
		Replying to
		<a
			class="text-cyan-500 hover:(text-cyan-400 underline) focus:(text-cyan-400 underline)"
			href="/{$tweet.replyOf.user.displayName}"
		>
			@{$tweet.replyOf.user.displayName}
		</a>
	</p>
{/if}
