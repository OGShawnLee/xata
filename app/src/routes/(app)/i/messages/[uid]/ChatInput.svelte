<script lang="ts">
	import { Rocket } from "lucide-svelte";
	import { TextArea } from "$lib/components";
	import { enhance } from "$app/forms";

	let form: HTMLFormElement;

	// Submit on enter
	function handleKeydown(event: KeyboardEvent) {
		if (event.code !== "Enter" || event.shiftKey) return;
		form.submit();
		event.preventDefault();
	}
</script>

<form class="mt-auto" method="post" bind:this={form} use:enhance>
	<div class="group flex items-center | bg-zinc-800 rounded-2xl overflow-hidden">
		<TextArea
			label="Message"
			id="message"
			placeholder="Start a new message"
			padding="p-2.75"
			on:keydown={handleKeydown}
			required
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
