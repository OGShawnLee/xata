<script lang="ts">
	import Intersection from "svelte-intersection-observer";
	import { chatContext } from "$lib/context";
	import { plural } from "$lib/utils";

	export let isChatHead = false;

	const { recipient, intersecting } = chatContext.getContext();
	const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });

	let element: HTMLElement;
</script>

<section
	class="p-8 | flex flex-col gap-3 | border-b-2 {isChatHead
		? 'border-zinc-700'
		: 'border-zinc-800'} text-center"
	class:lg:mt-18={!isChatHead}
>
	{#if !isChatHead}
		<Intersection {element} bind:intersecting={$intersecting}>
			<header bind:this={element}>
				<h2 class="text-lg font-medium text-white">{$recipient.name}</h2>
				<a class="text-sm text-zinc-500" href="/{$recipient.displayName}">
					@{$recipient.displayName}
				</a>
			</header>
		</Intersection>
	{:else}
		<header>
			<h2 class="text-lg font-medium text-white">{$recipient.name}</h2>
			<a class="text-sm text-zinc-500" href="/{$recipient.displayName}">
				@{$recipient.displayName}
			</a>
		</header>
	{/if}
	{#if $recipient.description}
		<p>{$recipient.description}</p>
	{/if}
	<p class="text-xs text-zinc-500">
		<time datetime={$recipient.createdAt.toISOString()}>
			Joined {formatter.format($recipient.createdAt)}
		</time>
		•
		<span>
			{$recipient.followerCount}
			{plural($recipient.followerCount, "Follower")}
		</span>
	</p>
</section>
