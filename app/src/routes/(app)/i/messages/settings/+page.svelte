<script lang="ts">
	import { Header } from "$lib/layout";
	import { Switch, SwitchDescription, SwitchGroup, SwitchLabel } from "malachite-ui";
	import { Check } from "lucide-svelte";
	import { useClassNameResolver } from "malachite-ui/hooks";
	import { applyAction, deserialize } from "$app/forms";

	export let data;

	const className = useClassNameResolver<"CHECKED">({
		base: "h-5 min-w-5 | grid place-content-center | rounded-md",
		checked: { on: "bg-cyan-600", off: "border-zinc-500 border-2 border-zinc-400" }
	});

	let form: HTMLFormElement;

	async function handleSubmit() {
		const response = await fetch(form.action, {
			method: form.method,
			body: new FormData(form)
		});
		const result = deserialize(await response.text());
		if (result.type === "error") applyAction(result);
	}
</script>

<svelte:head>
	<title>Direct Messages Settings - Twitter</title>
</svelte:head>

<div class="grid gap-3">
	<Header as="h2" title="Direct Messages" padding="px-6" />
	<div class="px-6">
		<SwitchGroup
			class="grid gap-1.25"
			initialChecked={data.hasPublicMessagingEnabled}
			let:isChecked
		>
			<form
				class="flex items-center justify-between"
				method="post"
				bind:this={form}
				on:submit|preventDefault={handleSubmit}
			>
				<SwitchLabel class="text-white cursor-pointer" on:click={handleSubmit}>
					Allow message requests from everyone
				</SwitchLabel>
				<input type="hidden" name="public-message-requests" value={isChecked} />
				<Switch class={className} checked={data.hasPublicMessagingEnabled} type="submit">
					{#if isChecked}
						<Check class="stroke-white" size={18} />
					{/if}
				</Switch>
			</form>
			<SwitchDescription class="text-sm text-zinc-500">
				Let people who you don't follow send you message requests. To reply to their messages, you
				need to accept the request.
			</SwitchDescription>
		</SwitchGroup>
	</div>
</div>
