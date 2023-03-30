<script>
	import DialogEditProfile from "./DialogEditProfile.svelte";
	import TabGroup from "./TabGroup.svelte";
	import UserInfo from "./UserInfo.svelte";
	import { Header } from "$lib/layout";
	import { useSwitch } from "malachite-ui/hooks";
	import { currentUser } from "$lib/state";
	import { enhance } from "$app/forms";

	export let data;

	$: foundUser = data.foundUser;
	$: isOwner = data.user?.id === foundUser.id;
	$: if (isOwner && foundUser.name && $currentUser) {
		$currentUser.name = foundUser.name;
	}

	const open = useSwitch(false);
</script>

<DialogEditProfile
	{open}
	description={foundUser.description}
	location={foundUser.location}
	name={foundUser.name} />

<div>
	<Header title={foundUser.name} displayName={foundUser.displayName}>
		<svelte:fragment slot="button">
			{#if isOwner}
				<button class="button-zinc" on:click={open.toggle}> Edit Profile </button>
			{:else if $currentUser}
				<form action="?/follow-or-unfollow" method="post" use:enhance>
					<button
						class="group {foundUser.isFollowed
							? 'button-white--filled button-danger--filled'
							: 'button-white'}"
						type="submit">
						<span class:group-hover:hidden={foundUser.isFollowed}>
							{foundUser.isFollowed ? "Following" : "Follow"}
						</span>
						{#if foundUser.isFollowed}
							<span class="hidden group-hover:inline"> Unfollow </span>
						{/if}
					</button>
				</form>
			{/if}
		</svelte:fragment>
	</Header>
	<UserInfo
		createdAt={foundUser.createdAt}
		description={foundUser.description}
		location={foundUser.location} />
	<TabGroup displayName={foundUser.displayName} />
</div>
<slot />
