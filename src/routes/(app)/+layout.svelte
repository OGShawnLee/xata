<script lang="ts">
	import type { LayoutData } from "./$types";
	import { Sidebar } from "$lib/layout";
	import { currentUser } from "$lib/state";

	export let data: LayoutData;

	currentUser.set(data.user);
</script>

<div class="relative max-w-6xl min-h-screen mx-auto py-8 | grid grid-cols-12 items-start gap-8">
	<Sidebar class="sticky top-8 col-span-3 pr-8" user={data.user} />
	<main class="col-span-6 | grid gap-8">
		<slot />
	</main>
</div>
