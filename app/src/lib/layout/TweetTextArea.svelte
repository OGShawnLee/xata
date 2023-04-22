<script lang="ts" context="module">
	function getCharCountColour(charCount: number) {
		if (charCount === 0) return "text-rose-500";
		if (charCount < 160) return "text-green-500";
		if (charCount >= 160 && charCount < 280) return "text-orange-500";
		return "text-red-500";
	}
</script>

<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";
	import { handleExpandableArea } from "$lib/actions";
	import { enhance } from "$app/forms";

	export let value: Nullable<string>;

	$: charCount = value?.trim().length || 0;
	$: disabled = isNullish(value) || isWhitespace(value);
</script>

<div class="border-b-2 border-zinc-800">
	<div class="px-8 pb-4">
		<form class="flex flex-col items-end gap-3" action="/home?/tweet" method="post" use:enhance>
			<label class="sr-only" for="tweet">Tweet</label>
			<textarea
				class="w-full py-2.5 | border-b-2 border-zinc-800 bg-transparent outline-none text-white placeholder-zinc-500 resize-none"
				name="tweet-text"
				id="tweet"
				cols="10"
				rows="1"
				maxlength={280}
				placeholder="What's happening?"
				data-minimum-rows="1"
				bind:value
				on:input={handleExpandableArea}
			/>
			<div class="flex items-center gap-6">
				{#if charCount}
					<div class="text-sm">
						<span class="transition {getCharCountColour(charCount)}"> {charCount}</span>
						<span> / </span>
						<span> 280 </span>
					</div>
				{/if}
				<button
					class="button-sm button--sky | px-6 rounded-full"
					class:button--disabled={disabled}
					{disabled}
				>
					Tweet
				</button>
			</div>
		</form>
	</div>
</div>
