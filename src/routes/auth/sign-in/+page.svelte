<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { AtSign, Key } from "lucide-svelte";
	import { Input } from "$lib/components";

	export let form: Nullable<{
		displayName?: { value: string; error?: string };
		password?: { error?: string };
	}>;
</script>

<svelte:head>
	<title>Sign In - Twitter</title>
</svelte:head>

<main class="w-full max-w-lg py-8 bg-zinc-800/30 rounded-lg">
	<div class="grid gap-4.5">
		<header class="px-8 pb-4 | border-b-2 border-zinc-800">
			<h1 class="text-3xl text-white font-bold font-poppins">Sign in</h1>
			<span class="text-sm font-roboto text-zinc-300">
				Don't have an account?
				<a
					class="text-sky-400 font-medium outline-none focus:underline hover:text-sky-300"
					href="/auth/sign-up"
				>
					Sign up!
				</a>
			</span>
		</header>
		<form class="px-8 | grid gap-6" method="post">
			<div class="grid gap-3">
				<Input
					id="display-name"
					label="Username"
					icon={AtSign}
					placeholder="OGJohnDoe"
					maxlength={16}
					minlength={1}
					value={form?.displayName?.value}
					error={form?.displayName?.error}
				/>
				<Input
					id="password"
					icon={Key}
					error={form?.password?.error}
					maxlength={80}
					minlength={8}
					type="password"
				/>
			</div>
			<button class="button button--white"> Continue </button>
		</form>
	</div>
</main>
