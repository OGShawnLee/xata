<script lang="ts">
	import ChatMessage from "./Message.svelte";
	import ChatRecipient from "./Recipient.svelte";
	import { chatContext } from "$lib/context";

	export let isChatHead = false;

	const { messages } = chatContext.getContext();
</script>

<div class="flex flex-col gap-3 {isChatHead ? 'pb-4' : 'pr-4 overflow-y-auto'}">
	<ChatRecipient {isChatHead} />
	<ul class="pl-6 pr-3 | flex flex-col gap-3" class:pl-6={isChatHead} class:pr-3={isChatHead}>
		{#each $messages as message (message.id)}
			<ChatMessage lighter {message} />
		{/each}
	</ul>
</div>
