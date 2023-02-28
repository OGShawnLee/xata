<script lang="ts">
	import type { SelectedPick } from "@xata.io/client";
	import type { NotificationsRecord } from "$lib/server/xata";
	import { Heart, Repeat } from "lucide-svelte";

	export let notification: SelectedPick<
		NotificationsRecord,
		("from.name" | "from.displayName" | "tweet.text" | "*")[]
	>;

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium" });
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="px-8 | grid gap-1.25">
		<header class="flex items-center gap-3">
			{#if notification.type === "LIKE"}
				<Heart class="fill-white stroke-white" />
			{:else}
				<Repeat class="stroke-white" />
			{/if}
			<div class="w-full flex items-baseline justify-between">
				<h3>
					<a class="hover:underline focus:underline" href="/{notification.from?.displayName}">
						<strong class="text-white"> {notification.from?.name} </strong>
					</a>
					{notification.type === "LIKE" ? "liked" : "retweeted"}
					your Tweet.
				</h3>
				<time class="text-xs text-zinc-500" datetime={notification.createdAt.toISOString()}>
					{formatter.format(notification.createdAt)}
				</time>
			</div>
		</header>
		<p class="text-sm text-zinc-400">{notification.tweet?.text}</p>
	</div>
</article>
