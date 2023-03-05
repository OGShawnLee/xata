<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import Header from "./Header.svelte";
	import Badge from "./Badge.svelte";
	import { ArrowRight } from "lucide-svelte";
	import { Bookmark, Like, Retweet } from "./Button";
	import { currentUser } from "$lib/state";
	import { isNullish } from "malachite-ui/predicate";

	export let displayName: Nullable<string>;
	export let name: Nullable<string>;
	export let createdAt: Date;
	export let id: string;
	export let text: string;
	export let isBookmarked: boolean;
	export let isLiked: boolean;
	export let likeCount = 0;
	export let retweetCount = 0;
	export let retweetOf: Nullable<{
		createdAt: Date;
		text: string;
		user: { displayName: string; name: string };
	}> = undefined;

	$: finalDisplayName = retweetOf ? retweetOf.user.displayName : displayName;
	$: finalName = retweetOf ? retweetOf.user.name : name;
	$: finalText = retweetOf ? retweetOf.text : text;
	$: finalCreatedAt = retweetOf ? retweetOf.createdAt : createdAt;
</script>

<article class="pb-4 | border-b-2 border-zinc-800">
	<div class="px-8 | grid gap-1.25">
		{#if retweetOf}
			<Badge {displayName} {name} />
		{/if}
		<Header displayName={finalDisplayName} name={finalName} createdAt={finalCreatedAt} />
		<p class="whitespace-pre-line">{finalText}</p>
		{#if $currentUser && isNullish(retweetOf)}
			<div class="flex items-center justify-between | pt-2.75">
				<Like {id} {likeCount} {isLiked} />
				<Retweet {id} {retweetCount} />
				<Bookmark {id} {isBookmarked} />
				<a href="/{displayName}/status/{id}" title="View Tweet">
					<ArrowRight />
					<span class="sr-only"> View Tweet </span>
				</a>
			</div>
		{/if}
	</div>
</article>
