<script>
	import { DialogCompose, DialogWarning, RelevantPeople, Sidebar } from "$lib/layout";
	import { currentUser } from "$lib/state";

	export let data;

	currentUser.set(data.user);
</script>

<DialogCompose />
<DialogWarning />

<div class="relative max-w-4xl min-h-screen mx-auto | grid grid-cols-12 items-start gap-8 | xl:max-w-6xl">
	<Sidebar class="sticky top-0 min-h-screen py-8 xl:(col-span-3 pr-8)" />
	<main class="pt-4 | col-span-8 grid gap-8 xl:col-span-6">
		<slot />
	</main>
	<aside class="pt-4 | col-span-3">
		<RelevantPeople />
	</aside>
</div>
