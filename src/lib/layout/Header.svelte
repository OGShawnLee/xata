<script lang="ts">
	export let title: string | undefined = undefined;
	export let displayName: string | undefined = undefined;
</script>

<header class="border-b-2 border-zinc-800 leading-3">
	<div class="px-8 pb-4">
		<h1 class="text-white text-2xl font-bold">{title}</h1>
		{#if displayName}
			<span class="text-sm text-zinc-500"> @{displayName} </span>
		{/if}
	</div>
</header>
