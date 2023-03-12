<script lang="ts">
	import Context from "./Context";
	import { Repeat } from "lucide-svelte";

	const tweet = Context.getContext();
</script>

<div class="flex items-center gap-1 | text-zinc-500">
	<svelte:component this={Repeat} size={14} />
	<span class="text-xs">
		<a class="font-semibold hover:underline focus:underline" href="/{$tweet.user.displayName}">
			{$tweet.user.name}
		</a>
		retweeted
	</span>
</div>
