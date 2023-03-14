<script lang="ts">
	import { NavigableItem } from "malachite-ui";

	export let action: string | undefined = undefined;
	export let href: string | undefined = undefined;
	export let isActive: boolean;
	export let isForm = false;
	export let text: string;

	const className =
		"relative w-full h-14 | flex items-center justify-center outline-none hover:(bg-zinc-800 text-white) focus:(bg-zinc-800 text-white)";
</script>

{#if isForm}
	<NavigableItem class={className} as="form" {action}>
		<slot />
		<button
			class="relative w-full h-full | flex items-center justify-center after:(bg-cyan-500)"
			type="submit"
		>
			<span
				class="relative w-[fit-content] h-full | grid place-content-center after:(bg-cyan-500)"
				data-item-active={isActive}
			>
				{text}
			</span>
		</button>
	</NavigableItem>
{:else}
	<NavigableItem class={className} as="a" {href}>
		<span
			class="relative h-full | grid place-content-center after:(bg-cyan-500)"
			data-item-active={isActive}
		>
			{text}
		</span>
	</NavigableItem>
{/if}

<style>
	[data-item-active="true"] {
		color: white;
		font-weight: 500;
	}

	[data-item-active="true"]::after {
		display: block;
	}

	span::after {
		content: "";
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 175%;
		height: 3.25px;
		display: none;
	}
</style>
