<script>
	import ChatHeader from "./ChatHeader.svelte";
	import ChatMessages from "./ChatMessages.svelte";
	import ChatInput from "./ChatInput.svelte";
	import { useChatRoom } from "$lib/hooks";

	export let data;

	const { remount } = useChatRoom(data.token, data);

	$: remount(data.token, data);

	let intersecting = true;
</script>

<svelte:head>
	<title>{data.recipient.name} - Twitter</title>
</svelte:head>

<div class="relative h-full | flex flex-col">
	<ChatHeader
		class="absolute top-0 inset-x-0 | bg-zinc-900/90 transform transition duration-250 {intersecting
			? 'opacity-0 pointer-events-none'
			: 'opacity-100'}"
	/>
	<div class="h-full | flex flex-col justify-between gap-6">
		<ChatMessages bind:intersecting />
		<ChatInput />
	</div>
</div>
