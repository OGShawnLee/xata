<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { Heart } from "lucide-svelte";

	export let from: Nullable<string>;
	export let createdAt: Date;
	export let text: Nullable<string>;

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium" });
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="px-8 | grid gap-1.25">
		<header class="flex items-center gap-3">
			<Heart class="fill-white stroke-white" />
			<div class="w-full flex items-baseline justify-between">
				<h3>
					<strong class="text-white">{from}</strong> liked your Tweet.
				</h3>
				<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
					{formatter.format(createdAt)}
				</time>
			</div>
		</header>
		<p class="text-sm text-zinc-400">{text}</p>
	</div>
</article>
