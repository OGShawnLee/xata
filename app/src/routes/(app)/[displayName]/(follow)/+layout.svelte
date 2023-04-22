<script>
	import { Tab, TabGroup } from "$lib/components";
	import { Header } from "$lib/layout";

	export let data;
</script>

<div>
	<Header title={data.foundUser.name} displayName={data.foundUser.displayName} />
	<TabGroup borderTop={false}>
		<Tab text="Following" href="following" auto/>
		<Tab text="Followers" href="followers" auto/>
	</TabGroup>
</div>
<slot />
