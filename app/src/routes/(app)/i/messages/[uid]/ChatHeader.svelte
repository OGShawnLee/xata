<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	let className: string;

	export { className as class };
	export let displayName: Nullable<string>;
	export let name: Nullable<string>;
</script>

<header
	class="{className} h-20 | flex items-center | border-b-2 border-zinc-800"
>
	<div class="flex items-baseline gap-3">
		<h2 class="text-lg text-white font-semibold">{name}</h2>
		<p class="text-sm text-zinc-500">
			{displayName}
		</p>
	</div>
</header>
