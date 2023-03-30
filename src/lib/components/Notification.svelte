<script lang="ts" context="module">
	const NOTIFICATION_TYPE_VERB: Record<NotificationEventType, string> = Object.freeze({
		FOLLOW: "followed",
		LIKE: "liked",
		REPLY: "replied to",
		RETWEET: "retweeted"
	});
</script>

<script lang="ts">
	import type { Notification, NotificationEventType } from "@types";
	import { Time, Tweet } from "$lib/components";
	import { Heart, MessageCircle, Repeat, UserPlus } from "lucide-svelte";

	export let notification: Notification;
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="px-8 | grid gap-1.25">
		<header class="flex items-center gap-1.75">
			{#if notification.type === "LIKE"}
				<Heart class="fill-white stroke-white" />
			{:else if notification.type === "RETWEET"}
				<Repeat class="stroke-white" />
			{:else if notification.type === "FOLLOW"}
				<UserPlus class="stroke-white" />
			{:else}
				<MessageCircle class="stroke-white" />
			{/if}
			<div class="w-full flex items-baseline justify-between">
				<h3>
					<a class="hover:underline focus:underline" href="/{notification.from?.displayName}">
						<strong class="text-white"> {notification.from?.name} </strong>
					</a>
					{NOTIFICATION_TYPE_VERB[notification.type]}
					{notification.type === "FOLLOW" ? "you." : "your Tweet."}
				</h3>
				<Time createdAt={notification.createdAt} />
			</div>
		</header>
		{#if notification.tweet.text}
			<p class="text-sm text-zinc-400 whitespace-pre-line" class:pb-2.75={notification.reply}>
				{notification.tweet?.text}
			</p>
		{/if}
		{#if notification.reply}
			<Tweet tweet={notification.reply} hasPadding={false} />
		{/if}
	</div>
</article>
