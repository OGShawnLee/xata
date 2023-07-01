<script lang="ts">
	import type { MessageSearch } from "@types";
	import SearchMessage from "./SearchMessage.svelte";
	import { ButtonBack } from "$lib/components";
	import { Mail } from "lucide-svelte";
	import { createEventDispatcher } from "svelte";

	export let messages: MessageSearch[];

	const dispatch = createEventDispatcher();
</script>

<section>
	<header class="px-8 py-3 | flex items-center gap-3 | border-b-2 border-zinc-800">
		<Mail />
		<h2 class="mr-auto | text-lg text-white font-medium">Messages</h2>
		<ButtonBack label="Show Conversations" on:click={() => dispatch("reset")} />
	</header>
	<ul>
		{#each messages as message (message.id)}
			<SearchMessage {message} />
		{/each}
	</ul>
</section>
