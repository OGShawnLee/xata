<script lang="ts">
	import { Rocket } from "lucide-svelte";
	import { TextArea } from "$lib/components";
	import { applyAction, deserialize } from "$app/forms";
	import { invalidateAll } from "$app/navigation";
	import { chatContext } from "$lib/context";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";

	const { connected, emitMessage } = chatContext.getContext();

	let form: HTMLFormElement;
	let input: HTMLTextAreaElement;
	let text: string | undefined = undefined;

	async function handleSubmit(this: HTMLFormElement) {
		if (isNullish(text) || isWhitespace(text)) return;
		if ($connected) {
			emitMessage(text);
			text = "";
			return;
		}

		const data = new FormData(this);
		text = "";
		const response = await fetch(this.action, {
			method: "POST",
			body: data
		});
		const result = deserialize(await response.text());
		if (result.type === "success") {
			await invalidateAll();
		}

		applyAction(result);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.code !== "Enter" || event.shiftKey) return;
		event.preventDefault();
		handleSubmit.bind(form)();
	}
</script>

<form
	class="sticky bottom-0 min-h-22 mt-auto mr-4 | flex items-center | bg-zinc-900/80 backdrop-filter backdrop-blur-sm lg:(mr-0 min-h-10)"
	method="post"
	bind:this={form}
	on:submit|preventDefault={handleSubmit}
>
	<div class="w-full | group flex items-center | bg-zinc-800 rounded-2xl overflow-hidden">
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
