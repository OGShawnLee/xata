<script>
	import { RelevantPeople, Sidebar } from "$lib/layout";
	import { currentUser } from "$lib/state";

	export let data;

	currentUser.set(data.user);
</script>

<div
	class="relative max-w-2xl min-h-screen mx-auto | flex items-start | md:(grid grid-cols-12 max-w-3xl) lg:(max-w-4xl) xl:(max-w-6xl)"
>
	<Sidebar
		class="md:(sticky w-auto col-span-1) xl:(col-span-3 pr-8)"
	/>
	<main
		class="min-h-screen pl-18 pt-4 pb-8 | col-span-10 flex flex-col gap-8 | border-r-2 border-zinc-800 md:pl-0 lg:col-span-8 xl:col-span-6"
	>
		<slot />
	</main>
	<aside class="pt-4 | hidden col-span-3 lg:block">
		<RelevantPeople />
	</aside>
</div>
