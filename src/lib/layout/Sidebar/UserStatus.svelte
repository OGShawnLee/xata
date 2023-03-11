<script lang="ts">
	import { LogOut } from "lucide-svelte";
	import { enhance } from "$app/forms";

	export let displayName: string;
	export let name: string;
</script>

<div class="mt-auto | flex items-center justify-between">
	<div class="flex flex-col items-start">
		<span class="text-white font-medium"> {name} </span>
		<span class="text-sm text-zinc-500"> @{displayName} </span>
	</div>
	<form action="/auth/sign-out" method="post" use:enhance>
		<button class="grid place-content-center" aria-label="Sign Out" title="Sign Out">
			<LogOut />
		</button>
	</form>
</div>
