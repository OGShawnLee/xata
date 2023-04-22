<script>
	import { Header } from "$lib/layout";
	import { Tab, TabGroup } from "$lib/components";
	import { page } from "$app/stores";
</script>

<svelte:head>
	<title>Home - Twitter</title>
</svelte:head>

<div>
	<Header title="Home" />
	<TabGroup borderTop={false}>
		<Tab text="Home" href="/home" isActive={$page.url.pathname === "/home"} />
		<Tab text="Following" href="/home/following" auto />
	</TabGroup>
</div>
<slot />
