<script lang="ts">
	import type { Message } from "@types";
	import { currentUser } from "$lib/state";

	export let message: Message;
	export let lighter = false;

	const isCurrentUser = $currentUser?.id === message.user;
</script>

<li
	class="p-2.5 max-w-10/12 | inline | rounded-2xl {isCurrentUser
		? 'bg-cyan-800 rounded-br-none self-end'
		: `${lighter ? 'bg-zinc-700' : 'bg-zinc-800'} rounded-bl-none self-start`}"
	id={message.id}
>
	<p>{message.text}</p>
</li>
