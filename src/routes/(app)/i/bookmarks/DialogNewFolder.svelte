<script lang="ts">
	import { ButtonClose, ButtonWhite, Dialog, Input } from "$lib/components";
	import { DialogTitle } from "malachite-ui";
	import { enhance } from "$app/forms";
	import { isNullish, isWhitespace } from "malachite-ui/predicate";

	export let description: string;
	export let name: string;
	export let open: boolean;

	$: disabled = isNullish(name) || isWhitespace(name);
</script>

<svelte:head>
	<title>Bookmarks - Twitter</title>
</svelte:head>

<Dialog bind:open let:close>
	<form
		class="grid gap-4.5"
		action="?/create-folder"
		method="post"
		use:enhance={() => () => {
			close();
			description = name = "";
		}}>
		<header class="px-8 pb-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<ButtonClose {close} />
			<DialogTitle class="text-xl text-white font-medium">Create Bookmark Folder</DialogTitle>
			<div class="ml-auto">
				<ButtonWhite {disabled} type="submit" text="Save" />
			</div>
		</header>
		<div class="px-8 | grid gap-3">
			<Input id="name" maxlength={50} minlength={1} bind:value={name} />
			<Input
				type="textarea"
				id="description"
				maxlength={120}
				minlength={0}
				bind:value={description} 
			/>
		</div>
	</form>
</Dialog>
