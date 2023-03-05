<script lang="ts">
	import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "malachite-ui";
	import { CardUser } from "$lib/components";
	import { X } from "lucide-svelte";
	import { hideScrollbar } from "$lib/actions";
	import { tweetRetweetsDialog } from "$lib/state";
</script>

<Dialog class="fixed inset-0 | grid place-content-center" bind:open={$tweetRetweetsDialog.open}>
	<DialogOverlay class="fixed inset-0 | bg-zinc-1000/80 backdrop-filter backdrop-blur-sm" />
	<DialogContent class="z-10 py-8 | w-xl bg-zinc-900 rounded-3xl" use={[hideScrollbar]} let:close>
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
				<DialogTitle class="text-xl text-white font-medium">Tweet retweeted by</DialogTitle>
			</header>
			<div class="grid gap-3 px-8">
				{#each $tweetRetweetsDialog.data as { id, user } (id)}
					<CardUser {...user} />
				{/each}
			</div>
		</div>
	</DialogContent>
</Dialog>
