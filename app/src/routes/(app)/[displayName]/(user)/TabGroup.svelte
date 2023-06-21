<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { Navigable, NavigableItem } from "malachite-ui";
	import { page } from "$app/stores";

	export let displayName: Nullable<string>;

	const className =
		"relative w-full h-14 | flex items-center justify-center outline-none hover:(bg-zinc-800 text-white) focus:(bg-zinc-800 text-white)";

	function getItemState(isRootPath: boolean, path = "", pathname: string) {
		return isRootPath ? pathname === "/" + displayName : pathname.endsWith(path);
	}

	$: pathname = $page.url.pathname;
</script>

<Navigable class="flex items-center justify-around | border-y-2 border-zinc-800">
	<NavigableItem class={className} as="a" href="/{displayName}">
		<span
			class="relative h-full | grid place-content-center after:(bg-cyan-500)"
			data-item-active={getItemState(true, "", pathname)}
		>
			Tweets
		</span>
	</NavigableItem>
	<NavigableItem class={className} as="a" href="/{displayName}/likes">
		<span
			class="relative h-full | grid place-content-center after:bg-cyan-500"
			data-item-active={getItemState(false, "/likes", pathname)}
		>
			Likes
		</span>
	</NavigableItem>
	<NavigableItem class={className} as="a" href="/{displayName}/highlights">
		<span
			class="relative h-full | grid place-content-center after:bg-cyan-500"
			data-item-active={getItemState(false, "/highlights", pathname)}
		>
			Highlights
		</span>
	</NavigableItem>
</Navigable>

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
