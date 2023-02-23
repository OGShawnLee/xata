<script lang="ts">
	import Button from "./Button.svelte";
	import { BookmarkMinus, BookmarkPlus } from "lucide-svelte";

	export let id: string;
	export let isBookmarked: boolean;

	$: icon = isBookmarked ? BookmarkMinus : BookmarkPlus;
	$: label = isBookmarked ? "Unbookmark Tweet" : "Bookmark Tweet";
</script>

<Button action="/home?/bookmark" {id} {label} {icon} />
