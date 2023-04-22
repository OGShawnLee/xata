<script lang="ts">
	import { fromTweetTextToHTML } from "$lib/utils";
	import { isNullish } from "malachite-ui/predicate";
	import type { Nullable } from "malachite-ui/types";

	export let displayName: Nullable<string> | undefined = undefined;
	export let id: string | undefined = undefined;
	export let isReplying = false;
	export let text: string;

	const finalText = fromTweetTextToHTML(text);
</script>

{#if isReplying || isNullish(displayName) || isNullish(id)}
	<p class="whitespace-pre-line">
		{@html finalText}
	</p>
{:else}
	<a href="/{displayName}/status/{id}" aria-label="View Tweet">
		<p class="whitespace-pre-line">{@html finalText}</p>
	</a>
{/if}
