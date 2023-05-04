<script lang="ts">
	import type { Message } from "@types";
	import { currentUser } from "$lib/state";

	export let message: Message;

	const isCurrentUser = $currentUser?.id === message.user;
</script>

<li
	class="p-2.5 max-w-10/12 | inline | rounded-2xl {isCurrentUser
		? 'bg-cyan-800 rounded-br-none self-end'
		: 'bg-zinc-800 rounded-bl-none self-start'}"
>
	<p>{message.text}</p>
</li>
