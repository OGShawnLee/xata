<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let displayName: Nullable<string>;
	export let id: string;
	export let replying: boolean;
	export let text: string;
</script>

{#if replying}
	<p class="whitespace-pre-line">{text}</p>
{:else}
	<a href="/{displayName}/status/{id}" aria-label="View Tweet">
		<p class="whitespace-pre-line">{text}</p>
	</a>
{/if}
