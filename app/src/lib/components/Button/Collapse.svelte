<script lang="ts">
	import { ChevronsUp } from "lucide-svelte";

	export let isOpen: boolean;
</script>

<button
	class="grid place-content-center"
	aria-label={isOpen ? "Collapse" : "Expand"}
	title={isOpen ? "Collapse" : "Expand"}
	on:click|stopPropagation
>
	<ChevronsUp class="transform {isOpen ? 'rotate-180' : 'rotate-0'}" />
</button>
