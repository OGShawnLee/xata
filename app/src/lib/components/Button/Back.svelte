<script lang="ts">
	import { ArrowLeft } from "lucide-svelte";

	export let label: string;
</script>

<button class="grid place-content-center" aria-label={label} title={label} on:click|stopPropagation>
	<ArrowLeft />
</button>
