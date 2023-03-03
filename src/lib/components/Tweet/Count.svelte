<script lang="ts" context="module">
	function plural(count: number, word: string) {
		return count === 1 ? word : word + "s";
	}
</script>

<script lang="ts">
	export let count: number;
	export let word: string;
</script>

{#if count}
	<span>
		<b class="text-sm font-victor">{count}</b>
		<span class="text-sm text-zinc-500">{plural(count, word)}</span>
	</span>
{/if}
