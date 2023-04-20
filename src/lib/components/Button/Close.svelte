<script lang="ts">
	import { X } from "lucide-svelte";

	export let close: () => void;
</script>

<button
	class="button-xs button--white | min-w-8 grid place-content-center rounded-full"
	aria-label="Close Dialog"
	title="Close Dialog"
	type="button"
	on:click={close}
>
	<X class="stroke-zinc-900" size={20} />
</button>
