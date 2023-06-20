<script lang="ts">
	import type { Chat } from "@types";
	import { ConversationLink } from "$lib/components";

	export let inbox: Chat[];
</script>

{#if inbox.length}
	<ul>
		{#each inbox as { id, recipient } (id)}
			<ConversationLink {recipient} />
		{/each}
	</ul>
{:else}
	<div class="px-8">
		<p class="mb-3 text-3xl text-white font-bold">Welcome to your inbox!</p>
		<p class="mb-7.5">
			Drop a line, share Tweets and more with private conversations between you and others on
			Twitter.
		</p>
		<button class="button button--cyan | px-8 rounded-full"> Write a message </button>
	</div>
{/if}
