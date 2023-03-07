<script lang="ts">
	import Context from "./Context";
	import { Menu, MenuButton, MenuItem, MenuItems } from "malachite-ui";
	import { Edit3 as Edit, Repeat } from "lucide-svelte";
	import { composeDialog } from "$lib/state";
	import { useClassNameResolver } from "malachite-ui/hooks";
	import { isNumber } from "malachite-ui/predicate";
	import { enhance } from "$app/forms";

	const className = useClassNameResolver<"ACTIVE">({
		base: "w-full px-4 py-2 | flex items-center gap-4.5",
		active: { off: "text-zinc-100", on: "bg-zinc-700 text-white" }
	});

	const tweet = Context.getContext();

	$: ({ id, createdAt, text, retweetCount, user } = $tweet);
</script>

<Menu class="relative" infinite>
	<MenuButton class="group | flex items-center gap-3" aria-label="Retweet" title="Retweet">
		<Repeat class="group-focus:stroke-white" />
		{#if isNumber(retweetCount)}
			<span class="text-sm"> {retweetCount} </span>
		{/if}
	</MenuButton>
	<MenuItems
		class="absolute top-0 -right-3 w-56 | bg-zinc-800 rounded-md shadow-lg overflow-hidden outline-none"
	>
		<MenuItem as="fragment" let:item let:isActive>
			<form action="/home?/retweet" method="post" use:enhance>
				<input type="hidden" name="tweet-id" value={id} />
				<button class={className({ isActive })} use:item>
					<Repeat size={20} />
					<span> Retweet </span>
				</button>
			</form>
		</MenuItem>
		<MenuItem as="fragment" let:item let:isActive>
			<button
				class={className({ isActive })}
				on:click={() => composeDialog.trigger("QUOTE", { id, createdAt, text, user })}
				use:item
			>
				<Edit size={20} />
				<span> Quote Tweet </span>
			</button>
		</MenuItem>
	</MenuItems>
</Menu>
