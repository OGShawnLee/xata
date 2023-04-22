<script>
	import { CardUser } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data;
</script>

<svelte:head>
	<title>People following {data.foundUser.name} (@{data.foundUser.displayName})</title>
</svelte:head>

<h1 class="sr-only">
	People following {data.foundUser.name} (@{data.foundUser.displayName})
</h1>

<Feed class="px-8" title="Users">
	{#each data.followers as user}
		<CardUser {...user} />
	{/each}
</Feed>
