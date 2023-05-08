<script lang="ts">
	import { Zap, ZapOff } from "lucide-svelte";
	import { chatContext } from "$lib/context";

	const { connected, intersecting, recipient } = chatContext.getContext();

	$: opacity = $intersecting ? "opacity-0" : "opacity-100";
</script>

<header
	class="sticky top-0 inset-x-0 h-20 px-4 | flex items-center justify-between | bg-zinc-900/90 border-b-2 border-zinc-800 md:px-0 lg:absolute"
>
	<div class="flex items-baseline gap-3 | transition duration-250 {opacity}">
		<h2 class="text-lg text-white font-semibold">{$recipient.name}</h2>
		<p class="text-sm text-zinc-500">
			{$recipient.displayName}
		</p>
	</div>
	<div title={$connected ? "Realtime Chat" : "Non-Realtime Chat"}>
		<svelte:component this={$connected ? Zap : ZapOff} />
	</div>
</header>
