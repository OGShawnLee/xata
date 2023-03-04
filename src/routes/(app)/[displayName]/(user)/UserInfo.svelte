<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { Calendar, MapPin } from "lucide-svelte";

	export let createdAt: Date;
	export let description: Nullable<string>;
	export let location: Nullable<string>;

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });
</script>

<div class="px-8 py-4 | grid gap-3">
	{#if description}
		<p>{description}</p>
	{/if}
	<div class="grid gap-1.5">
		<div class="flex items-center gap-1.75">
			<Calendar size="20" />
			<time class="text-xs text-zinc-500" datetime={createdAt.toISOString()}>
				Joined {formatter.format(createdAt)}
			</time>
		</div>
		{#if location}
			<div class="flex items-center gap-1.75">
				<MapPin size="20" />
				<span class="text-xs text-zinc-500"> {location} </span>
			</div>
		{/if}
	</div>
</div>
