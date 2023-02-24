<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { isNumber } from "malachite-ui/predicate";

	export let action: string;
	export let count: number | undefined = undefined;
	export let label: string;
	export let id: string;
	export let icon: typeof SvelteComponent;
</script>

<form {action} method="post">
	<input type="hidden" name="tweet-id" value={id} />
	<button class="flex items-center gap-3 | group" aria-label={label} title={label}>
		<svelte:component this={icon} class="group-focus:stroke-white" />
		{#if isNumber(count)}
			<span class="text-sm"> {count} </span>
		{/if}
	</button>
</form>
