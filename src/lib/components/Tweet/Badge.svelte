<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { Repeat } from "lucide-svelte";

	export let displayName: Nullable<string>;
	export let name: Nullable<string>;
</script>

<div class="flex items-center gap-1.75 text-zinc-500">
	<svelte:component this={Repeat} size={16} />
	<span class="text-sm">
		<a class="font-medium hover:underline focus:underline" href="/{displayName}"> {name} </a>
		retweeted
	</span>
</div>
