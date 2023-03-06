<script lang="ts">
	import Context from './Context'
	import { Repeat } from "lucide-svelte";

	const { user } = Context.getContext()
</script>

<div class="flex items-center gap-1.75 text-zinc-500">
	<svelte:component this={Repeat} size={16} />
	<span class="text-sm">
		<a class="font-medium hover:underline focus:underline" href="/{user.displayName}"> {user.name} </a>
		retweeted
	</span>
</div>
