<script>
	import ChatHeader from "./ChatHeader.svelte";
	import { ChatConversation, ChatInput } from "$lib/components";
	import { useChatRoom } from "$lib/hooks";

	export let data;

	const remount = useChatRoom(data.token, data);

	$: remount(data.token, data);
</script>

<svelte:head>
	<title>{data.recipient.name} - Twitter</title>
</svelte:head>

<div class="relative h-full | flex flex-col">
	<ChatHeader />
	<div class="min-h-screen h-full | flex flex-col justify-between gap-6 lg:min-h-max">
		<ChatConversation />
		<ChatInput />
	</div>
</div>
