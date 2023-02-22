<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
	import { AtSign, Key, Mail, User } from "lucide-svelte";
	import { Input } from "$lib/components";

	export let form: Nullable<{
		displayName?: { value: string; error?: string };
		email?: { value: string; error?: string };
		name?: { value: string; error?: string };
		password?: { error?: string };
	}>;
</script>

<svelte:head>
	<title>Sign Up - Twitter</title>
</svelte:head>

<main class="w-full max-w-lg py-8 bg-zinc-800/30 rounded-lg">
	<div class="grid gap-4.5">
		<header class="px-8 pb-4 | border-b-2 border-zinc-800">
			<h1 class="text-3xl text-white font-bold font-poppins">Join Twitter</h1>
			<span class="text-sm font-roboto text-zinc-300">
				Already have an account
				<a
					class="text-sky-400 font-medium outline-none focus:underline hover:text-sky-300"
					href="/auth/sign-in"
				>
					Sign in!
				</a>
			</span>
		</header>
		<form class="px-8 | grid gap-6" method="post">
			<div class="grid gap-3">
				<Input
					id="email"
					icon={Mail}
					placeholder="OGJohnDoe@example.com"
					minlength={5}
					maxlength={64}
					value={form?.email?.value}
					error={form?.email?.error}
					type="email"
				/>
				<Input
					id="name"
					icon={User}
					placeholder="John Doe"
					maxlength={50}
					minlength={1}
					value={form?.name?.value}
					error={form?.name?.error}
				/>
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
