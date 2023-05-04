<script>
	import "virtual:windi.css";
	import { DialogCompose, DialogWarning } from "$lib/layout";
</script>

<DialogCompose />
<DialogWarning />

<slot />

<style>
	:global(::-webkit-scrollbar) {
		background-color: hsl(240, 8%, 14%);
		width: 0.75vw;
		min-width: 0.5rem;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: hsl(240, 12%, 30%);
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background-color: hsl(240, 15%, 40%);
	}
</style>
