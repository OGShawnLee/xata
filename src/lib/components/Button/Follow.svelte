<script lang="ts">
	import { enhance } from "$app/forms";

	export let isFollowed: boolean;
</script>

<form action="?/follow-or-unfollow" method="post" use:enhance>
	<button
		class="group {isFollowed ? 'button-white--filled button-danger--filled' : 'button-white'}"
		type="submit"
	>
		<span class:group-hover:hidden={isFollowed}>
			{isFollowed ? "Following" : "Follow"}
		</span>
		{#if isFollowed}
			<span class="hidden group-hover:inline"> Unfollow </span>
		{/if}
	</button>
</form>
