<script lang="ts">
	import { isNullish } from "malachite-ui/predicate";
	import { clearString } from "malachite-ui/utils";

	let className = "";

	export { className as class };
	export let title: string | undefined = undefined;

	$: finalClassName = clearString("border-b-2 border-zinc-800" + className);

	if ($$slots.default === false && isNullish(title))
		throw new Error("Title must be provided if Header is rendered without default slot.");
</script>

<header class={finalClassName}>
	<div class="px-8 pb-4">
		<slot>
			<h1 class="text-white text-2xl font-bold">{title}</h1>
		</slot>
	</div>
</header>
