<script lang="ts">
	import type { Chat, Recipient } from "@types";
	import type { Maybe } from "malachite-ui/types";
	import { ButtonClose, ButtonWhite, ConversationLink, Dialog, Input } from "$lib/components";
	import { DialogTitle } from "malachite-ui";
	import { Search } from "lucide-svelte";
	import { goto } from "$app/navigation";
	import { useAPI } from "$lib/hooks";
	import { isObject, isString } from "malachite-ui/predicate";
	import { newMessageDialog } from "$lib/state";

	export let inbox: Chat[];

	let form: HTMLFormElement;
	let results: Maybe<Recipient[]>;

	$: items = results ?? inbox;

	async function handleSubmit() {
		const data = new FormData(form);
		const people = data.get("people");

		if (!isString(people) || people.length < 3) return;

		const result = await useAPI("/messages/search/user/[query]", people);
		form.reset();
		if (result.failed) return;
		results = result.data;
	}
</script>

<Dialog bind:open={$newMessageDialog} let:close padding={false}>
	<div class="grid gap-4.5">
		<header class="px-8 py-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<ButtonClose {close} />
			<DialogTitle class="text-xl text-white font-medium">New Message</DialogTitle>
			<div class="ml-auto | flex items-center gap-3">
				<ButtonWhite on:click={handleSubmit}>Next</ButtonWhite>
			</div>
		</header>
		<form class="px-8" bind:this={form} on:submit|preventDefault={handleSubmit}>
			<Input id="people" placeholder="Search people" nolabel icon={Search} />
		</form>
		<div class="border-t-2 border-zinc-800">
			{#each items as item (item.id)}
				{@const recipient = isObject(item, ["recipient"]) ? item.recipient : item}
				<ConversationLink
					as="button"
					{recipient}
					on:click={() => {
						newMessageDialog.toggle();
						goto("/i/messages/" + recipient.id);
					}}
				/>
			{/each}
		</div>
	</div>
</Dialog>
