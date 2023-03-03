<script lang="ts" context="module">
	function getRetweetAction(isBookmarkPage: boolean) {
		const path = "/home?/retweet";
		return isBookmarkPage ? path + "&redirect=/i/bookmarks" : path;
	}
</script>

<script lang="ts">
	import Button from "./Button.svelte";
	import { Repeat } from "lucide-svelte";
	import { page } from "$app/stores";

	export let id: string;
	export let retweetCount: number | undefined = undefined;

	$: action = getRetweetAction(isBookmarkPage);
	$: isBookmarkPage = $page.url.pathname.includes("i/bookmarks");
</script>

<Button {action} {id} label="Repeat" icon={Repeat} count={retweetCount} />
