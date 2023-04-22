<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import type { SubmitFunction } from "$app/forms";
	import { applyAction, enhance, deserialize } from "$app/forms";
	import { warningDialog } from "$lib/state";
	import { invalidateAll } from "$app/navigation";

	export let displayName: Nullable<string>;
	export let isFollowed: boolean;

	const handleSubmit: SubmitFunction = (event) => {
		if (isFollowed && displayName) {
			event.cancel();
			warningDialog.dispatch({
				type: "UNFOLLOW",
				displayName,
				onContinue: async () => {
					const response = await fetch(event.form.action, {
						method: "POST",
						body: new FormData(event.form.this),
						headers: { "x-sveltekit-action": "true" }
					});
					const result = deserialize(await response.text());
					if (result.type === "success") await invalidateAll();
					applyAction(result);
				}
			});
		}
	};
</script>

<form action="?/follow-or-unfollow" method="post" use:enhance={handleSubmit}>
	<button
		class="button button--white hover:opacity-100 | group px-8 rounded-full"
		class:button--danger={isFollowed}
		type="submit"
	>
		<span class:group-hover:hidden={isFollowed}>
			{isFollowed ? "Following" : "Follow"}
		</span>
		{#if isFollowed}
			<span class="hidden group-hover:inline"> Unfollow </span>
		{/if}
	</button>
</form>
