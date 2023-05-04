<script lang="ts">
	import type { Recipient } from "@types";
	import { page } from "$app/stores";

	export let recipient: Recipient;

	$: isActive = recipient.id ? $page.url.pathname.includes(recipient.id) : false;
</script>

<li>
	<a
		class="px-8 py-4 | flex items-baseline gap-3 {isActive ? 'bg-zinc-800 hover:bg-zinc-800/50' : 'hover:bg-zinc-800'}"
		href="/i/messages/{recipient.id}"
		aria-label="View Conversation"
	>
		<p class="text-white font-medium">{recipient.name}</p>
		<p class="text-sm text-zinc-500">@{recipient.displayName}</p>
	</a>
</li>
