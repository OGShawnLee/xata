<script lang="ts">
	import { useClassNameResolver } from "malachite-ui/hooks";

	export let disabled = false;
	export let small = false;
	export let text: string | undefined = undefined
	export let type: "button" | "submit" | "reset" = "button";

	$: className = useClassNameResolver<"DISABLED">({
		base: `${
			small ? "px-4.75 h-7.5" : "px-6 h-8"
		} | bg-white text-zinc-900 font-medium rounded-full transition`,
		disabled: { off: "hover:(bg-white/80 focus:bg-white)", on: "button--disabled" }
	});
</script>

<button class={className({ isDisabled: disabled })} {disabled} {type}>
	<slot> {text} </slot>
</button>
