<script lang="ts">
	import Link from "./Link.svelte";
	import UserStatus from "./UserStatus.svelte";
	import { Bookmark, Home } from "lucide-svelte";

	let className: string;

	export { className as class };
	export let user: JWTPayloadState;
</script>

<nav class="{className} | grid gap-12">
	<i class="bx bxl-twitter text-4xl text-white" />
	<div class="grid gap-6">
		<Link icon={Home} href="/home" text="Home" />
		<Link icon={Bookmark} href="/i/bookmarks" text="Bookmarks" />
	</div>
	<UserStatus displayName={user.displayName} name={user.name} />
</nav>
