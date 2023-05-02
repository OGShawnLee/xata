<script lang="ts">
	import { Dialog, DialogContent, DialogOverlay } from "malachite-ui";
	import { hideScrollbar } from "$lib/actions";

	export let open = false;
	export let initialFocus: HTMLElement | undefined = undefined;
	export let padding = true
	export let small = false;
</script>

<Dialog class="fixed inset-0 | grid place-content-center" {initialFocus} bind:open>
	<DialogOverlay class="fixed inset-0 | bg-zinc-1000/80 backdrop-filter backdrop-blur-sm" />
	<DialogContent
		class="z-10 {padding ? 'py-8' : 'py-0'} | {small ? 'w-sm' : 'w-xl'} bg-zinc-900 rounded-3xl"
		use={[hideScrollbar]}
		let:close
	>
		<slot {close} />
	</DialogContent>
</Dialog>
