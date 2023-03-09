<script lang="ts">
	import Context from "../Context";
	import Menu from "./Menu.svelte";
	import { MenuItem } from "malachite-ui";
	import { Edit3 as Edit, Repeat } from "lucide-svelte";
	import { composeDialog } from "$lib/state";
	import { useClassNameResolver } from "malachite-ui/hooks";
	import { enhance } from "$app/forms";

	export let counter = true;

	const className = useClassNameResolver<"ACTIVE">({
		base: "w-full px-4 py-2 | flex items-center gap-4.5",
		active: { off: "text-zinc-100", on: "bg-zinc-700 text-white" }
	});
	const tweet = Context.getContext();

	$: ({ id, createdAt, text, retweetCount, user } = $tweet);
</script>

<Menu label="Retweet" count={retweetCount} {counter} icon={Repeat}>
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
</Menu>
