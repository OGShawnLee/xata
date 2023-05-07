<script lang="ts">
	import { Zap, ZapOff } from 'lucide-svelte'
	import { chatContext } from "$lib/context";

	let className: string;

	export { className as class };

	const { connected, recipient } = chatContext.getContext();
</script>

<header class="{className} h-20 | flex items-center justify-between | border-b-2 border-zinc-800">
	<div class="flex items-baseline gap-3">
		<h2 class="text-lg text-white font-semibold">{$recipient.name}</h2>
		<p class="text-sm text-zinc-500">
			{$recipient.displayName}
		</p>
	</div>
	<div title={$connected ? "Realtime Chat" : "Non-Realtime Chat"}>
		<svelte:component this={$connected ? Zap : ZapOff}/>
	</div>
</header>
