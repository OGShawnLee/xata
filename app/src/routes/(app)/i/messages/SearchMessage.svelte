<script lang="ts">
	import type { MessageSearch } from "@types";
	import { Time } from "$lib/components";

	export let message: MessageSearch;
</script>

<li class="border-2 border-transparent outline-none hover:(bg-zinc-800) focus-within:border-white">
	<a
		class="px-8 py-3 | grid gap-1.5 | outline-none"
		href="/i/messages/{message.recipient}"
		aria-label="View Conversation"
		title="View Conversation"
	>
		<div class="flex items-baseline gap-3">
			<p class="text-white font-medium">{message.user}</p>
			<Time createdAt={message.createdAt} isMessage />
		</div>
		<p class="text-sm">{message.text}</p>
	</a>
</li>
