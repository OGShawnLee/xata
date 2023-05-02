<script lang="ts">
	import { LogOut } from "lucide-svelte";
	import { enhance } from "$app/forms";

	export let displayName: string;
	export let name: string;
</script>

<div class="w-full mt-auto | flex items-center justify-between">
	<div class="hidden | flex-col items-start xl:flex">
		<span class="text-white font-medium"> {name} </span>
		<span class="text-sm text-zinc-500"> @{displayName} </span>
	</div>
	<form class="w-full xl:w-auto" action="/auth/sign-out" method="post" use:enhance>
		<button class="w-full grid place-content-center" aria-label="Sign Out" title="Sign Out">
			<LogOut />
		</button>
	</form>
</div>
