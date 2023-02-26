<script lang="ts">
	import type { PageData } from "./$types";
	import { Feed, Header } from "$lib/layout";
	import { Notification } from "$lib/components";

	export let data: PageData;
</script>

<svelte:head>
	<title>Notifications - Twitter</title>
</svelte:head>

<Header title="Notifications" displayName={data.user.displayName} />
<Feed>
	{#each data.notifications as { from, tweet, createdAt, id } (id)}
		<Notification {from} {createdAt} text={tweet?.text} />
	{/each}
</Feed>
