<script lang="ts">
	import type { LayoutData } from "./$types";
	import TabGroup from "./TabGroup.svelte";
	import { Header } from "$lib/layout";

	export let data: LayoutData;

	$: displayName = data.foundUser.displayName;
	$: title = data.foundUser.name;
	$: createdAt = data.foundUser.createdAt;
</script>

<div>
	<Header {title} {displayName} {createdAt} />
	<TabGroup {displayName} />
</div>
<slot />
