<script lang="ts">
	import { Dialog } from "$lib/components";
	import { DialogTitle, DialogDescription } from "malachite-ui";
	import { warningDialog } from "$lib/state";

	const { open, state } = warningDialog;

	let buttonClose: HTMLElement;
</script>

<Dialog bind:open={$open} initialFocus={buttonClose} small let:close>
	<div class="px-8 | grid gap-6">
		<div class="grid gap-3">
			<DialogTitle class="text-xl text-white font-medium">
				Unfollow @{$state?.displayName}?
			</DialogTitle>
			<DialogDescription>
				Their Tweets will no longer show up in your following timeline. You can still view their
				profile.
			</DialogDescription>
		</div>
		<div class="grid gap-3">
			<button
				class="w-full h-10.75 min-h-10.75 | bg-white border-2 border-transparent rounded-full text-zinc-900 font-medium outline-none hover:opacity-90 focus:(border-black ring-2 ring-white)"
				on:click={() => {
					$state?.onContinue();
					close();
				}}
			>
				Unfollow
			</button>
			<button
				class="w-full h-10.75 min-h-10.75 | border-2 border-zinc-800 rounded-full text-zinc-100 font-medium outline-none hover:bg-zinc-800 focus:(ring-2 ring-white)"
				on:click={close}
				bind:this={buttonClose}
			>
				Cancel
			</button>
		</div>
	</div>
</Dialog>
