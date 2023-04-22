<script lang="ts">
	import Context from "../Context";
	import Menu from "./Menu.svelte";
	import { MenuItem } from "malachite-ui";
	import { BookmarkMinus, BookmarkPlus, Link, Share } from "lucide-svelte";
	import { useClassNameResolver } from "malachite-ui/hooks";
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import { isNullish } from "malachite-ui/predicate";

	export let counter = true;

	const className = useClassNameResolver<"ACTIVE">({
		base: "w-full px-4 py-2 | flex items-center gap-4.5",
		active: { off: "text-zinc-100", on: "bg-zinc-700 text-white" }
	});
	const tweet = Context.getContext();

	$: ({ id, user, isBookmarked } = $tweet);

	function copyTweetLinkToClipboard() {
		if (isNullish(user.displayName)) return;
		const link = $page.url.origin + `/${user.displayName}/status/${id}`;
		try {
			navigator.clipboard.writeText(link);
		} catch (error) {
			console.log(error);
		}
	}
</script>

<Menu label="Retweet" {counter} icon={Share}>
	<MenuItem as="fragment" let:item let:isActive>
		<button class={className({ isActive })} use:item on:click={copyTweetLinkToClipboard}>
			<Link size={20} />
			<span> Copy link to Tweet </span>
		</button>
	</MenuItem>
	<MenuItem as="fragment" let:item let:isActive>
		<form action="/home?/bookmark-or-unbookmark" method="post" use:enhance>
			<input type="hidden" name="tweet-id" value={id} />
			<button class={className({ isActive })} use:item>
				<svelte:component this={isBookmarked ? BookmarkMinus : BookmarkPlus} size={20} />
				<span> {isBookmarked ? "Unbookmark" : "Bookmark"} </span>
			</button>
		</form>
	</MenuItem>
</Menu>
