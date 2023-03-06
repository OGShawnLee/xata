<script lang="ts">
	import { useClassNameResolver } from "malachite-ui/hooks";

	export let disabled = false;
	export let type: "button" | "submit" | "reset" = "button";

	const className = useClassNameResolver<"DISABLED">({
		base: "px-6 h-8 | bg-white text-zinc-900 font-medium rounded-full transition",
		disabled: { off: "hover:(bg-white/80 focus:bg-white)", on: "button--disabled" }
	});
</script>

<button class={className({ isDisabled: disabled })} {disabled} {type}>
	<slot />
</button>
