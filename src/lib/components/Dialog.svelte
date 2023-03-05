<script lang="ts">
	import { Dialog, DialogContent, DialogOverlay } from "malachite-ui";
	import { hideScrollbar } from "$lib/actions";

	export let open = false;
</script>

<Dialog class="fixed inset-0 | grid place-content-center" bind:open>
	<DialogOverlay class="fixed inset-0 | bg-zinc-1000/80 backdrop-filter backdrop-blur-sm" />
	<DialogContent class="z-10 py-8 | w-xl bg-zinc-900 rounded-3xl" use={[hideScrollbar]} let:close>
		<slot {close} />
	</DialogContent>
</Dialog>
