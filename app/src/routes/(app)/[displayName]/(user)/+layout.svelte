<script>
	import DialogEditProfile from "./DialogEditProfile.svelte";
	import TabGroup from "./TabGroup.svelte";
	import UserInfo from "./UserInfo.svelte";
	import { ButtonFollow, ButtonMessage } from "$lib/components";
	import { Header } from "$lib/layout";
	import { useSwitch } from "malachite-ui/hooks";
	import { currentUser } from "$lib/state";
	import { userProfileContext } from "$lib/context";
	import { writable } from "svelte/store";

	export let data;

	const user = userProfileContext.setContext(writable(data.foundUser));

	$: foundUser = data.foundUser;
	$: isOwner = data.user?.id === foundUser.id;
	$: user.set(data.foundUser);
	$: if (isOwner && foundUser.name && $currentUser) {
		$currentUser.name = foundUser.name;
	}

	const open = useSwitch(false);
</script>

<DialogEditProfile
	{open}
	description={foundUser.description}
	location={foundUser.location}
	name={foundUser.name}
/>
<div>
	<Header title={foundUser.name} displayName={foundUser.displayName}>
		<svelte:fragment slot="button">
			{#if isOwner}
				<button class="button button--zinc | px-8 rounded-full" on:click={open.toggle}>
					Edit Profile
				</button>
			{:else if $currentUser}
				<div class="flex gap-3">
					<ButtonMessage to={foundUser.id} />
					<ButtonFollow displayName={foundUser.displayName} isFollowed={foundUser.isFollowed} />
				</div>
			{/if}
		</svelte:fragment>
	</Header>
	<UserInfo />
	<TabGroup displayName={foundUser.displayName} />
</div>
<slot />
