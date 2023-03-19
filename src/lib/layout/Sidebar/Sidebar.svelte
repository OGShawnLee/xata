<script lang="ts">
	import Link from "./Link.svelte";
	import SearchInput from "./SearchInput.svelte";
	import UserStatus from "./UserStatus.svelte";
	import { Bell, Bookmark, Home, User } from "lucide-svelte";
	import { currentUser } from "$lib/state";

	let className: string;

	export { className as class };
</script>

<nav class="{className} | grid gap-12">
	<i class="bx bxl-twitter text-4xl text-white" />
	<SearchInput />
	{#if $currentUser}
		<div class="grid gap-6">
			<Link icon={Home} href="/home" text="Home" />
			<Link icon={Bookmark} href="/i/bookmarks" text="Bookmarks" />
			<Link icon={Bell} href="/i/notifications" text="Notifications" />
			<Link icon={User} href="/{$currentUser.displayName}" text="Profile" />
		</div>
	{/if}
	{#if $currentUser}
		<UserStatus displayName={$currentUser.displayName} name={$currentUser.name} />
	{/if}
</nav>
