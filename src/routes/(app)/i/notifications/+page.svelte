<script lang="ts">
	import type { Notification } from "@types";
	import { Feed, Header } from "$lib/layout";
	import { Notification as NotificationComponent } from "$lib/components";
	import { useInfiniteScrolling } from "$lib/hooks";

	export let data;

	const fetchMoreNotifications = useInfiniteScrolling<Notification>({
		endpoint: "/i/notifications",
		onSuccess: (next) => {
			data.feed.page = next.page;
			data.feed.records = data.feed.records.concat(next.records);
		},
		onError: console.error
	});
</script>

<svelte:head>
	<title>Notifications - Twitter</title>
</svelte:head>

<Header title="Notifications" displayName={data.user.displayName} />
<Feed more={data.feed.page.more} on:intersect={() => fetchMoreNotifications(data.feed.page)}>
	{#each data.feed.records as notification (notification.id)}
		<NotificationComponent {notification} />
	{/each}
</Feed>
