<script>
	import Inbox from "./Inbox.svelte";
	import { Header, Sidebar } from "$lib/layout";
	import { currentUser } from "$lib/state";

	export let data;

	currentUser.set(data.user);
</script>

<div
	class="relative max-w-2xl min-h-screen mx-auto | flex items-start | md:(grid grid-cols-12 max-w-3xl) lg:(max-w-4xl) xl:(max-w-6xl gap-8)"
>
	<Sidebar
		class="fixed top-0 min-h-screen w-18 pt-10 pb-8 | border-r-2 border-zinc-800 md:(sticky w-auto col-span-1) xl:(pr-8 col-span-3 border-none)"
	/>
	<section class="min-h-screen pl-18 pt-4 | col-span-10 flex flex-col border-r-2 border-zinc-800 md:pl-0 lg:col-span-4 xl:(col-span-4 border-none)">
		<Header as="h2" title="Messages" />
		<Inbox inbox={data.inbox.records} />
	</section>
	<main class="h-full max-h-screen pt-4 pb-8 | lg:(pl-8 col-span-7) xl:col-span-5">
		<slot />
	</main>
</div>
