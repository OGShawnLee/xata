<script lang="ts">
	import type { Recipient } from "@types";
	import { page } from "$app/stores";

	export let as: "a" | "button" = "a";
	export let recipient: Recipient;

	$: isActive = recipient.id ? $page.url.pathname.includes(recipient.id) : false;
	$: activeClassName = isActive ? "bg-zinc-800 hover:bg-zinc-800/50" : "hover:bg-zinc-800";
</script>

<li>
	{#if as === "a"}
		<a
			class="px-8 py-4 | flex items-baseline gap-3 {activeClassName}"
			href="/i/messages/{recipient.id}"
			aria-label="View Conversation"
		>
			<p class="text-white font-medium">{recipient.name}</p>
			<p class="text-sm text-zinc-500">@{recipient.displayName}</p>
		</a>
	{:else}
		<button
			class="w-full px-6 py-4 | flex items-baseline gap-3 hover:bg-zinc-700"
			aria-label="View Conversation"
			title="View Conversation"
			on:click
		>
			<p class="text-white font-medium">{recipient.name}</p>
			<p class="text-sm text-zinc-500">@{recipient.displayName}</p>
		</button>
	{/if}
</li>
