<script lang="ts">
	import { useClassNameResolver } from "malachite-ui/hooks";

	export let disabled = false;
	export let type: "button" | "submit" | "reset" = "button";
	export let small = false;

	$: className = useClassNameResolver<"DISABLED">({
		base: `${
			small ? "px-4.75 h-7.5" : "px-6 h-8"
		} | bg-white text-zinc-900 font-medium rounded-full transition`,
		disabled: { off: "hover:(bg-white/80 focus:bg-white)", on: "button--disabled" }
	});
</script>

<button class={className({ isDisabled: disabled })} {disabled} {type}>
	<slot />
</button>
