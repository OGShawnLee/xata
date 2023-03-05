<script lang="ts">
	import type { Nullable, Switch } from "malachite-ui/types";
	import { DialogTitle } from "malachite-ui";
	import { Dialog, Input } from "$lib/components";
	import { MapPin, User, X } from "lucide-svelte";
	import { page } from "$app/stores";
	import { enhance } from "$app/forms";
	import { currentUser } from "$lib/state";

	export let open: Switch;
	export let name: Nullable<string>;
	export let description: Nullable<string>;
	export let location: Nullable<string>;

	$: finalDescription = $page.form?.description?.value || description;
	$: finalName = $page.form?.name?.value || name;
	$: finalLocation = $page.form?.location?.value || location;
</script>

<Dialog bind:open={$open} let:close>
	<form class="grid gap-4.5" action="/{$currentUser?.displayName}" method="post" use:enhance>
		<header class="px-8 pb-4 | flex items-center gap-4.5 | border-b-2 border-zinc-800">
			<button
				class="h-8 min-w-8 | bg-white rounded-full grid place-content-center hover:(bg-white/80 focus:bg-white)"
				aria-label="Close Dialog"
				title="Close Dialog"
				on:click={close}
				type="button"
			>
				<X class="stroke-zinc-900" size={20} />
			</button>
			<DialogTitle class="text-xl text-white font-medium">Edit Profile</DialogTitle>
			<button
				class="ml-auto px-6 min-h-8 h-8 | bg-white text-zinc-900 font-medium rounded-full hover:(bg-white/80 focus:bg-white)"
				type="submit"
			>
				Save
			</button>
		</header>
		<div class="grid gap-3 px-8">
			<Input
				id="name"
				icon={User}
				placeholder={finalName}
				maxlength={50}
				minlength={1}
				value={finalName}
				error={$page.form?.name?.error}
			/>
			<Input
				id="description"
				type="textarea"
				maxlength={160}
				value={finalDescription}
				error={$page.form?.description?.error}
			/>
			<Input
				id="location"
				icon={MapPin}
				maxlength={30}
				value={finalLocation}
				error={$page.form?.location?.error}
			/>
		</div>
	</form>
</Dialog>
