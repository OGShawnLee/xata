<script lang="ts">
	import Link from "./Link.svelte";
	import Search from "./Search.svelte";
	import UserStatus from "./UserStatus.svelte";
	import { Bell, Bookmark, Home, LogIn, PenTool, Twitter, User } from "lucide-svelte";
	import { composeDialog, currentUser } from "$lib/state";

	let className: string;

	export { className as class };
</script>

<nav class="{className} | flex flex-col items-center gap-6 xl:(gap-12 items-start)">
	<Twitter class="mx-auto stroke-white fill-white xl:mx-0" />
	<Search />
	{#if $currentUser}
		<div class="flex flex-col items-center gap-6 xl:items-start">
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
		<a
			class="button button--cyan | w-full | grid place-content-center | rounded-xl"
			href="/auth/sign-in"
		>
			<span class="sr-only xl:not-sr-only"> Sign In </span>
			<LogIn class="xl:hidden" />
		</a>
	{/if}
</nav>
