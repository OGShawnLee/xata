<script>
	import { Feed, Header } from "$lib/layout";
	import { Notification } from "$lib/components";

	export let data;
</script>

<svelte:head>
	<title>Notifications - Twitter</title>
</svelte:head>

<Header title="Notifications" displayName={data.user.displayName} />
<Feed>
	{#each data.notifications as notification (notification.id)}
		<Notification {notification} />
	{/each}
</Feed>
