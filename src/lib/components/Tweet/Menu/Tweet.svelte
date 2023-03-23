<script lang="ts">
	import Context from "../Context";
	import Menu from "./Menu.svelte";
	import { MenuItem } from "malachite-ui";
	import { MoreHorizontal, Pin, PinOff } from "lucide-svelte";
	import { useClassNameResolver } from "malachite-ui/hooks";
	import { isNullish } from "malachite-ui/predicate";
	import { enhance } from "$app/forms";
	import { currentUser } from "$lib/state";

	export let isPinned = false;

	const className = useClassNameResolver<"ACTIVE">({
		base: "w-full px-4 py-2 | flex items-center gap-4.5",
		active: { off: "text-zinc-100", on: "bg-zinc-700 text-white" }
	});
	const tweet = Context.getContext(false);
</script>

{#if $tweet && $tweet.user.id === $currentUser?.id && isNullish($tweet.retweetOf)}
	<Menu
		label="View Tweet Options"
		counter={false}
		icon={MoreHorizontal}
		iconClass="stroke-zinc-500"
		iconSize={20}>
		<MenuItem as="fragment" let:item let:isActive>
			<form action="/home?/{isPinned ? 'unpin' : 'pin'}" method="post" use:enhance>
				<input type="hidden" name="tweet-id" value={$tweet.id} />
				<button class={className({ isActive })} use:item>
					<svelte:component this={isPinned ? PinOff : Pin} size={20} />
					<span> {isPinned ? "Unpin Tweet" : "Pin Tweet"} </span>
				</button>
			</form>
		</MenuItem>
	</Menu>
{/if}
