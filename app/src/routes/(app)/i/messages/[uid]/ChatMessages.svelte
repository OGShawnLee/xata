<script lang="ts">
	import RecipientInfo from "./RecipientInfo.svelte";
	import Intersection from "svelte-intersection-observer";
	import { MessageBlob } from "$lib/components";
	import { chatContext } from "$lib/context";
	
	export let intersecting = false;

	const { messages } = chatContext.getContext();

	let element: HTMLElement;
</script>

<div class="pr-4 | flex flex-col gap-3 | overflow-y-auto">
	<RecipientInfo />
	<Intersection bind:element bind:intersecting>
		<div bind:this={element} />
	</Intersection>
	<ul class="flex flex-col gap-3">
		{#each $messages as message (message.id)}
			<MessageBlob {message} />
		{/each}
	</ul>
</div>
