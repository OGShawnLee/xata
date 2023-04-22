<script>
	import { getCharCountColour } from "$lib/utils";

	export let charCount = 0;

	$: charColour = getCharCountColour(charCount);
</script>

<span class="text-sm">
	<span class="transition {charColour}"> {charCount}</span>
	<span> / </span>
	<span> 280 </span>
</span>
