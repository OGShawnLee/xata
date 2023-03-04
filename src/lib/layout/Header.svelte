<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let title: Nullable<string> = undefined;
	export let displayName: Nullable<string> = undefined;
</script>

<header class="border-b-2 border-zinc-800 leading-3">
	<div class="px-8 pb-4 | flex items-center justify-between">
		<div>
			<h1 class="text-white text-2xl font-bold">{title}</h1>
			{#if displayName}
				<div class="flex items-baseline justify-between gap-3">
					<span class="text-sm text-zinc-500"> @{displayName} </span>
				</div>
			{/if}
		</div>
		<slot name="button" />
	</div>
</header>
