<script lang="ts">
	import ChatContext from "./ChatContext";
	import RecipientInfo from "./RecipientInfo.svelte";
	import Intersection from "svelte-intersection-observer";
	import { MessageBlob } from "$lib/components";
	import { tick } from "svelte";

	export let intersecting = false;

	const data = ChatContext.getContext()

	let bottomElement: HTMLElement;
	let element: HTMLElement;

	$: if (bottomElement) scrollIntoView(bottomElement)

	async function scrollIntoView(element: HTMLElement) {
		await tick()
		element.scrollIntoView()
	} 
</script>

<div class="pr-4 | flex flex-col gap-3 | overflow-y-auto">
	<RecipientInfo />
	<Intersection bind:element bind:intersecting>
		<div bind:this={element} />
	</Intersection>
	<ul class="flex flex-col gap-3">
		{#each $data.messages as message (message.id)}
			<MessageBlob {message} />
		{/each}
	</ul>
	{#key $data.recipient}
	<div bind:this={bottomElement} />
	{/key}
</div>
