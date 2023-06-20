<script lang="ts">
	import type { Maybe } from "malachite-ui/types";
	import type { Chat, ChatData } from "@types";
	import {
		ButtonBack,
		ButtonCollapse,
		ChatConversation,
		ChatInput,
		ConversationLink
	} from "$lib/components";
	import { useAPI, useChatRoom } from "$lib/hooks";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { currentUser } from "$lib/state";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";

	let conversation: (ChatData & { token: string }) | undefined;
	let inbox: Chat[] = [];
	let isOpen = false;
	let remount: Maybe<ReturnType<typeof useChatRoom>>;

	$: if (conversation) {
		if (remount) remount(conversation.token, conversation);
		else remount = useChatRoom(conversation.token, conversation, true);
	}
	$: isMessagesPage = $page.url.pathname.includes("/i/messages");

	function toggle() {
		if (!isOpen) loadConversationList();
		isOpen = !isOpen;
	}

	async function loadConversationList() {
		const result = await useAPI("/messages");
		if (result.failed) return console.warn(result.error);
		inbox = result.data.records;
	}

	async function loadConversation(uid: string | undefined) {
		if (isNullish(uid) || isWhitespace(uid)) return;
		const result = await useAPI("/messages/[uid]", uid);
		if (result.failed) return console.warn(result.error);
		conversation = result.data;
	}

	onMount(() => loadConversationList());
</script>

{#if $currentUser && !isMessagesPage}
	<div
		class="fixed bottom-0 right-8 w-88 h-128 h-128 | hidden | bg-zinc-800 rounded-t-xl overflow-y-auto transform transition duration-250 {isOpen
			? 'translate-y-0'
			: 'translate-y-114'} xl:(flex flex-col)"
	>
		<div class="flex flex-col">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="sticky top-0 z-10 h-14 min-h-14 px-6 | flex items-center gap-3 | bg-zinc-800/80 backdrop-filter backdrop-blur-sm cursor-pointer"
				on:click={toggle}
			>
				{#if conversation}
					<div class="h-full w-full | flex items-center justify-between">
						<div class="flex items-center gap-3">
							<ButtonBack label="Show Conversations" on:click={() => (conversation = undefined)} />
							<h2 class="text-xl text-white font-bold">{conversation.recipient.name}</h2>
						</div>
						<div class="flex items-center gap-3">
							<ButtonCollapse {isOpen} on:click={toggle} />
						</div>
					</div>
				{:else}
					<div class="h-full w-full | flex items-center justify-between">
						<h2 class="text-xl text-white font-bold">Messages</h2>
						<ButtonCollapse {isOpen} on:click={toggle} />
					</div>
				{/if}
			</div>

			{#if isOpen}
				{#if conversation}
					<ChatConversation isChatHead />
				{:else}
					<ul>
						{#each inbox as { id, recipient } (id)}
							<ConversationLink
								as="button"
								{recipient}
								on:click={() => loadConversation(recipient.id)}
							/>
						{/each}
					</ul>
				{/if}
			{/if}
		</div>
		{#if conversation}
			<ChatInput isChatHead />
		{/if}
	</div>
{/if}
