<script lang="ts">
	import { DialogTitle } from "malachite-ui";
	import { CardUser, Dialog } from "$lib/components";
	import { X } from "lucide-svelte";
	import { tweetLikesDialog } from "$lib/state";
</script>

<Dialog bind:open={$tweetLikesDialog.open} let:close>
	<div class="grid gap-4.5">
		<header class="px-8 pb-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<button
				class="h-8 min-w-8 | bg-white rounded-full grid place-content-center hover:(bg-white/80 focus:bg-white)"
				aria-label="Close Dialog"
				title="Close Dialog"
				on:click={close}
				type="button"
			>
				<X class="stroke-zinc-900" size={20} />
			</button>
			<DialogTitle class="text-xl text-white font-medium">Tweet liked by</DialogTitle>
		</header>
		<div class="grid gap-3 px-8">
			{#each $tweetLikesDialog.data as { id, user } (id)}
				<CardUser {...user} />
			{/each}
		</div>
	</div>
</Dialog>
