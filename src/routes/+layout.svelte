<script>
	import "virtual:windi.css";
</script>

<slot />

<style>
	:global(::-webkit-scrollbar) {
		background-color: hsl(240, 8%, 14%);
		width: 0.75vw;
	}

	:global(::-webkit-scrollbar-thumb) {
		background-color: hsl(240, 12%, 30%);
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background-color: hsl(240, 15%, 40%);
	}
</style>
