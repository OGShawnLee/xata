<script lang="ts">
	import Inbox from "./Inbox.svelte";
	import { Header, Sidebar } from "$lib/layout";
	import { currentUser } from "$lib/state";
	import { page } from "$app/stores";

	export let data;

	currentUser.set(data.user);

	let innerWidth: number;
	$: inChatPage = $page.params.uid !== undefined;
</script>

<svelte:window bind:innerWidth />

<div
	class="relative max-w-2xl min-h-screen w-full mx-auto | flex items-start | md:(max-w-2xl) lg:(max-w-4xl grid grid-cols-12) xl:(max-w-6xl)"
>
	<Sidebar class="md:(sticky w-auto col-span-1) xl:(pr-8 col-span-3)" />

	{#if innerWidth > 1024 || !inChatPage}
		<svelte:element
			this={inChatPage ? "section" : "main"}
			class="min-h-screen w-full pl-18 pt-4 | flex flex-col | border-r-2 border-zinc-800 md:pl-0 lg:col-span-4 xl:(col-span-4)"
		>
			<Header as={innerWidth > 1024 ? "h2" : "h1"} title="Messages" />
			<Inbox inbox={data.inbox.records} />
		</svelte:element>
	{/if}

	{#if innerWidth > 1024 || inChatPage}
		<main
			class="h-full pt-4 pl-22 | sm:pl-26 md:pl-0 lg:(max-h-screen pb-8 col-span-7) xl:col-span-5"
		>
			<slot />
		</main>
	{/if}
</div>
