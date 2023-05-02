<script>
	import SearchDialog from "./SearchDialog.svelte";
	import SearchInput from "./SearchInput.svelte";
	import { Search } from "lucide-svelte";
	import { useSwitch } from "malachite-ui/hooks";

	const open = useSwitch(false);
</script>

<SearchInput class="hidden xl:block" />

<button
	class="group | grid place-content-center xl:hidden"
	aria-label="Open Search Dialog"
	title="Open Search Dialog"
	on:click={open.toggle}
>
	<Search class="group-focus:stroke-white" />
</button>

<SearchDialog bind:open={$open} />
