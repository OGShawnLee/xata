<script lang="ts">
	import SearchInput from "./SearchInput.svelte";
	import { Dialog } from "$lib/components";
	import { DialogTitle } from "malachite-ui";

	export let open: boolean;
</script>

<Dialog bind:open padding={false}>
	<DialogTitle class="sr-only text-xl text-white font-medium">Search</DialogTitle>
	<SearchInput big />
</Dialog>
