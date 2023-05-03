<script>
	import { DialogCompose, DialogWarning, RelevantPeople, Sidebar } from "$lib/layout";
	import { currentUser } from "$lib/state";

	export let data;

	currentUser.set(data.user);
</script>

<DialogCompose />
<DialogWarning />

<div
	class="relative max-w-2xl min-h-screen mx-auto | flex items-start | md:(grid grid-cols-12 max-w-3xl) lg:(max-w-4xl gap-8) xl:max-w-6xl"
>
	<Sidebar
		class="fixed top-0 min-h-screen w-18 pt-10 pb-8 | border-r-2 border-zinc-800 md:(sticky w-auto col-span-2) lg:border-none xl:(col-span-3 pr-8)"
	/>
	<main class="pl-18 pt-4 | col-span-10 grid gap-8 md:pl-0 lg:col-span-8 xl:col-span-6">
		<slot />
	</main>
	<aside class="pt-4 | hidden col-span-3 lg:block">
		<RelevantPeople />
	</aside>
</div>
