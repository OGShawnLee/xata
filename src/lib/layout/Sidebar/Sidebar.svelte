<script lang="ts">
	import Link from "./Link.svelte";
	import UserStatus from "./UserStatus.svelte";
	import { Home } from "lucide-svelte";

	let className: string;

	export { className as class };
	export let user: JWTPayloadState;
</script>

<nav class="{className} | grid gap-12">
	<i class="bx bxl-twitter text-4xl text-white" />
	<Link icon={Home} href="/home" text="Home" />
	<UserStatus displayName={user.displayName} name={user.name} />
</nav>
