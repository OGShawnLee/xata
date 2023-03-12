<script lang="ts">
	import Context from "../Context";
	import Menu from "./Menu.svelte";
	import { MenuItem } from "malachite-ui";
	import { MoreHorizontal, Pin } from "lucide-svelte";
	import { useClassNameResolver } from "malachite-ui/hooks";
	import { enhance } from "$app/forms";
	import { currentUser } from "$lib/state";

	const className = useClassNameResolver<"ACTIVE">({
		base: "w-full px-4 py-2 | flex items-center gap-4.5",
		active: { off: "text-zinc-100", on: "bg-zinc-700 text-white" }
	});
	const tweet = Context.getContext();

	$: ({ id, user } = $tweet);
</script>

{#if user.id === $currentUser?.id}
	<Menu
		label="View Tweet Options"
		counter={false}
		icon={MoreHorizontal}
		iconClass="stroke-zinc-500"
		iconSize={20}
	>
		<MenuItem as="fragment" let:item let:isActive>
			<form action="/home?/pin" method="post" use:enhance>
				<input type="hidden" name="tweet-id" value={id} />
				<button class={className({ isActive })} use:item>
					<Pin size={20} />
					<span> Pin Tweet </span>
				</button>
			</form>
		</MenuItem>
	</Menu>
{/if}
