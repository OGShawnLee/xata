<script lang="ts">
	import type { Nullable } from "malachite-ui/types";

	export let createdAt: Date;
	export let displayName: Nullable<string>;
	export let name: Nullable<string>;

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium" });
</script>

<header class="flex items-baseline justify-between">
	<div class="flex items-baseline gap-3">
		<h3 class="text-white font-medium">{name}</h3>
		<a class="text-sm text-zinc-500 hover:underline focus:underline" href="/{displayName}">
			@{displayName}
		</a>
	</div>
	<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
		{formatter.format(createdAt)}
	</time>
</header>
