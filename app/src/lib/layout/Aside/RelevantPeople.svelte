<script>
	import { CardUser } from "$lib/components";
	import { layout } from "$lib/state";
</script>

{#if $layout.type === "RELEVANT-PEOPLE"}
	<section class="grid gap-4.5">
		<header class="h-20 pl-8 | flex items-center | border-b-2 border-zinc-800">
			<h2 class="text-xl text-white font-medium">Relevant People</h2>
		</header>
		<div class="pl-8 | grid gap-3">
			{#each $layout.data.relevantPeople as { id, description, displayName, name } (id)}
				<CardUser {description} {displayName} {name} />
			{/each}
		</div>
	</section>
{/if}
