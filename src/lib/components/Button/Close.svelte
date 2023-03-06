<script lang="ts">
	import { X } from "lucide-svelte";

	export let close: () => void;
</script>

<button
	class="h-8 min-w-8 | bg-white rounded-full grid place-content-center hover:(bg-white/80 focus:bg-white)"
	aria-label="Close Dialog"
	title="Close Dialog"
	on:click={close}
	type="button"
>
	<X class="stroke-zinc-900" size={20} />
</button>
