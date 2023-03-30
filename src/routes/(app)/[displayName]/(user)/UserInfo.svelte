<script lang="ts">
	import { Calendar, MapPin } from "lucide-svelte";
	import { userProfileContext } from "$lib/context";
	import { plural } from "$lib/utils";

	const user = userProfileContext.getContext();

	const formatter = Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" });
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
		<a
			class="text-xs text-zinc-400 hover:underline focus:underline"
			href="/{$user.displayName}/following"
		>
			<b class="text-white"> {$user.followingCount} </b>
			<span> Following </span>
		</a>
		<a
			class="text-xs text-zinc-400 hover:underline focus:underline"
			href="/{$user.displayName}/followers"
		>
			<b class="text-white"> {$user.followerCount} </b>
			<span> {plural($user.followerCount, "Follower")} </span>
		</a>
	</div>
</div>
