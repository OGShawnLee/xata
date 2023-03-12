<script lang="ts">
	import type { SvelteComponent } from "svelte";
	import { isNumber } from "malachite-ui/predicate";
	import { clearString } from "malachite-ui/utils";
	import { enhance } from "$app/forms";

	export let action: string | undefined = undefined;
	export let count: number | undefined = undefined;
	export let label: string;
	export let id: string;
	export let icon: typeof SvelteComponent;
	export let fill = false;

	$: iconClassName = clearString(
		`group-focus:stroke-white ${fill ? "fill-current group-focus:fill-white" : ""}`
	);
</script>

{#if action}
	<form {action} method="post" use:enhance>
		<input type="hidden" name="tweet-id" value={id} />
		<button class="flex items-center gap-3 | group" aria-label={label} title={label} on:click>
			<svelte:component this={icon} class={iconClassName} />
			{#if isNumber(count)}
				<span class="text-sm"> {count} </span>
			{/if}
		</button>
	</form>
{:else}
	<button class="flex items-center gap-3 | group" aria-label={label} title={label} on:click>
		<svelte:component this={icon} class={iconClassName} />
		{#if isNumber(count)}
			<span class="text-sm"> {count} </span>
		{/if}
	</button>
{/if}
