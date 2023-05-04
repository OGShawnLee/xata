<script>
	import { plural } from "$lib/utils";
	import ChatContext from "./ChatContext";

	const data = ChatContext.getContext();
	const formatter = Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" });
</script>

<section class="p-8 | flex flex-col gap-3 | border-b-2 border-zinc-800 text-center">
	<header>
		<h2 class="text-lg font-medium text-white">{$data.recipient.name}</h2>
		<a class="text-sm text-zinc-500" href="/{$data.recipient.displayName}">@{$data.recipient.displayName}</a>
	</header>
	{#if $data.recipient.description}
		<p>{$data.recipient.description}</p>
	{/if}
	<p class="text-xs text-zinc-500">
		<time datetime={$data.recipient.createdAt.toISOString()}>
			Joined {formatter.format($data.recipient.createdAt)}
		</time>
		•
		<span>
			{$data.recipient.followerCount} {plural($data.recipient.followerCount, "Follower")}
		</span>
	</p>
</section>
