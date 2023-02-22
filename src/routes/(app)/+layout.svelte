<script lang="ts">
	import type { LayoutData } from "./$types";
	import { Sidebar } from "$lib/layout";

	export let data: LayoutData;
</script>

<div class="max-w-6xl min-h-screen mx-auto py-8 | grid grid-cols-12 items-start gap-8">
	<Sidebar class="col-span-3 pr-8" user={data.user} />
	<main class="col-span-6">
		<slot />
	</main>
</div>
