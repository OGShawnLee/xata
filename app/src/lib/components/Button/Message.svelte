<script lang="ts">
	import { MessageCircle } from "lucide-svelte";

	export let to: string;
</script>

<a
	class="button button--zinc | min-w-10 grid place-content-center rounded-full"
	href="/i/messages/{to}"
>
	<MessageCircle />
</a>
