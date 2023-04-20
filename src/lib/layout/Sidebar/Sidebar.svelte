<script lang="ts">
	import Link from "./Link.svelte";
	import SearchInput from "./SearchInput.svelte";
	import UserStatus from "./UserStatus.svelte";
	import { Bell, Bookmark, Home, PenTool, User } from "lucide-svelte";
	import { composeDialog, currentUser } from "$lib/state";

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
			<Link
				icon={PenTool}
				text="Compose"
				on:click={(event) => {
					event.preventDefault();
					composeDialog.trigger("COMPOSE");
				}}
			/>
		</div>
	{/if}
	{#if $currentUser}
		<UserStatus displayName={$currentUser.displayName} name={$currentUser.name} />
	{:else}
		<a class="button button--sky | grid place-content-center | rounded-xl" href="/auth/sign-in">
			<span> Sign In </span>
		</a>
	{/if}
</nav>
