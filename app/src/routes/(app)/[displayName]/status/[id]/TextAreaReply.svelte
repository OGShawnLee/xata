<script lang="ts">
	import { ButtonWhite, CharCount, TextArea } from "$lib/components";
	import { currentUser } from "$lib/state";
	import { useCleanup, useListener } from "malachite-ui/hooks";
	import { onMount } from "svelte";
	import { enhance } from "$app/forms";
	import { isNullish } from "malachite-ui/predicate";

	export let hasBottomBorder = false;

	let charCount = 0;
	let element: HTMLTextAreaElement | undefined;
	let hasFocus = false;

	$: disabled = charCount === 0;
	$: isTextAreaToRender = hasFocus || charCount > 0;

	onMount(() => {
		if (isNullish(element)) return;
		return useCleanup(
			useListener(element, "focus", () => (hasFocus = true)),
			useListener(element, "focusout", () => (hasFocus = false))
		);
	});
</script>

{#if $currentUser}
	<section class={hasBottomBorder ? "pb-4 border-b-2 border-zinc-800" : undefined}>
		<div class="px-8">
			<h2 class="sr-only">Reply Text Area</h2>
			<form class="flex flex-col" action="?/reply" method="post" use:enhance>
				<div class="flex items-baseline gap-3">
					<span class="text-white font-medium"> {$currentUser.name} </span>
					<span class="text-sm text-zinc-500"> @{$currentUser.displayName} </span>
				</div>
				<TextArea
					id="tweet-text"
					label="Reply"
					placeholder="What is your reply?"
					bind:charCount
					bind:element
				/>
				{#if isTextAreaToRender}
					<div class="ml-auto flex items-center gap-3">
						<CharCount {charCount} />
						<ButtonWhite {disabled} type="submit">Reply</ButtonWhite>
					</div>
				{/if}
			</form>
		</div>
	</section>
{/if}
