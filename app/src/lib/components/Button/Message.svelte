<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { MessageCircle } from "lucide-svelte";

	export let to: { id: string; displayName: Nullable<string> };
</script>

<a
	class="button button--zinc | min-w-10 grid place-content-center rounded-full"
	href="/i/messages/{to.id}"
	aria-label="Send {to.displayName} a message"
	title="Send {to.displayName} a message"
>
	<MessageCircle />
</a>
