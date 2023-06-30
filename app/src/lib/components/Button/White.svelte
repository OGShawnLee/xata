<script lang="ts">
	export let disabled = false;
	export let text: string | undefined = undefined;
	export let type: "button" | "submit" | "reset" = "button";
</script>

<button
	class="button-xs button--white | px-6 rounded-full"
	class:button--disabled={disabled}
	{disabled}
	{type}
	on:click
>
	<slot>{text}</slot>
</button>
