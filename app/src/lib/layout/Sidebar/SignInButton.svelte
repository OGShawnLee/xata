<script lang="ts">
	import { LogIn } from "lucide-svelte";
</script>

<a
	class="button button--cyan | w-full | grid place-content-center | rounded-xl"
	href="/auth/sign-in"
>
	<span class="sr-only xl:not-sr-only"> Sign In </span>
	<LogIn class="xl:hidden" />
</a>
