<script lang="ts">
	import type { SvelteComponent } from "svelte";

	export let action: string;
	export let label: string;
	export let id: string;
	export let icon: typeof SvelteComponent;
</script>

<form {action} method="post">
	<input type="hidden" name="tweet-id" value={id} />
	<button class="grid place-content-center | group" aria-label={label} title={label}>
		<svelte:component this={icon} class="group-focus:stroke-white" />
	</button>
</form>
