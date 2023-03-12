<script lang="ts">
	import Context from "../Context";
	import Button from "./Button.svelte";
	import { MessageCircle } from "lucide-svelte";
	import { composeDialog } from "$lib/state";

	export let counter = true;

	const tweet = Context.getContext();

	$: ({ id, replyCount } = $tweet);
	$: count = counter ? replyCount : undefined;
</script>

<Button
	{id}
	label="Reply"
	icon={MessageCircle}
	{count}
	on:click={() => composeDialog.trigger("REPLY", $tweet)}
/>
