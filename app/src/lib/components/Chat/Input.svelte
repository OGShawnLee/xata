<script lang="ts">
	import { Rocket } from "lucide-svelte";
	import { TextArea } from "$lib/components";
	import { chatContext } from "$lib/context";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";
	import { useAPI } from "$lib/hooks";

	export let isChatHead = false;

	const { connected, emitMessage, formAction, recipient, messages } = chatContext.getContext();

	let form: HTMLFormElement;
	let input: HTMLTextAreaElement;
	let text: string | undefined = undefined;

	async function handleSubmit(this: HTMLFormElement) {
		if (isNullish(text) || isWhitespace(text)) return;
		if ($connected) {
			emitMessage(text);
			text = "";
		} else if ($recipient.id) {
			const body = new FormData(form);
			text = "";
			const result = await useAPI("/messages/[uid]:POST", $recipient.id, body);
			if (result.failed) return console.warn(result.error);
			messages.update((messages) => {
				messages.push(result.data);
				return messages;
			});
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.code !== "Enter" || event.shiftKey) return;
		event.preventDefault();
		handleSubmit.bind(form)();
	}
</script>

<form
	class="sticky bottom-0 inset-x-0 min-h-22 mt-auto | flex items-center | {isChatHead
		? 'bg-transparent'
		: 'pl-6 bg-zinc-900/80 backdrop-filter backdrop-blur-sm'} lg:(min-h-10)"
	action={$formAction}
	method="post"
	bind:this={form}
	on:submit|preventDefault={handleSubmit}
>
	<div
		class="w-full | group flex items-center | {isChatHead
			? 'bg-zinc-700'
			: 'bg-zinc-800 rounded-xl overflow-hidden'}"
	>
		<TextArea
			label="Message"
			id="message"
			placeholder="Start a new message"
			padding="p-2.75"
			required
			bind:element={input}
			bind:value={text}
			on:keydown={onKeydown}
		/>
		<button
			type="submit"
			class="mr-2 p-1.5 | flex items-center | text-cyan-500 rounded-full hover:bg-zinc-700"
			aria-label="Send message"
			title="Send message"
		>
			<Rocket size={20} />
		</button>
	</div>
</form>
