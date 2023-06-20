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
				class="button button--white | w-full rounded-full"
				on:click={() => {
					$state?.onContinue();
					close();
				}}
			>
				Unfollow
			</button>
			<button
				class="button button--zinc | w-full rounded-full"
				on:click={close}
				bind:this={buttonClose}
			>
				Cancel
			</button>
		</div>
	</div>
</Dialog>
