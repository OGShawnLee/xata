<script lang="ts">
	import { Count } from "$lib/components";
	import { Calendar, MapPin } from "lucide-svelte";
	import { userProfileContext } from "$lib/context";

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });
	const user = userProfileContext.getContext();

	$: path = "/" + $user.displayName;
</script>

<div class="px-8 py-4 | grid gap-3">
	{#if $user.description}
		<p>{$user.description}</p>
	{/if}
	<div class="grid gap-1.5">
		<div class="flex items-center gap-1.75">
			<Calendar size="20" />
			<time class="text-xs text-zinc-500" datetime={$user.createdAt.toISOString()}>
				Joined {formatter.format($user.createdAt)}
			</time>
		</div>
		{#if $user.location}
			<div class="flex items-center gap-1.75">
				<MapPin size="20" />
				<span class="text-xs text-zinc-500"> {$user.location} </span>
			</div>
		{/if}
	</div>
	<div class="flex gap-4.5">
		<Count href="{path}/following" count={$user.followingCount} text="Following" irregular user />
		<Count href="{path}/followers" count={$user.followerCount} text="Follower" user />
		<Count count={$user.tweetCount} text="Tweet" user />
	</div>
</div>
