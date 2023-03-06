<script lang="ts">
	import type { PageData } from "./$types";
	import { Tweet } from "$lib/components";
	import { Feed } from "$lib/layout";

	export let data: PageData;
</script>

<Feed>
	{#each data.tweets as tweet (tweet.id)}
		<Tweet {tweet} />
	{/each}
</Feed>
