<script lang="ts">
	import { Navigable } from "malachite-ui";

	export let borderTop = true;
</script>

<Navigable
	class="flex items-center justify-around | {borderTop
		? 'border-y-2'
		: 'border-b-2'} border-zinc-800"
>
	<slot />
</Navigable>
