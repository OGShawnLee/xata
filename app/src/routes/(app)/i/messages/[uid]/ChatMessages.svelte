<script>
	import RecipientInfo from "./RecipientInfo.svelte";
	import { MessageBlob } from "$lib/components";
	import { chatContext } from "$lib/context";
	
	const { messages } = chatContext.getContext();
</script>

<div class="pr-4 | flex flex-col gap-3 | overflow-y-auto">
	<RecipientInfo />
	<ul class="flex flex-col gap-3">
		{#each $messages as message (message.id)}
			<MessageBlob {message} />
		{/each}
	</ul>
</div>
