<script lang="ts">
	import type { Nullable } from "malachite-ui/types";
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
		</header>
		<form class="px-8 | grid gap-6" method="post">
			<div class="grid gap-3">
				<Input
					id="email"
					icon="bx-envelope"
					placeholder="OGJohnDoe@example.com"
					minlength={5}
					maxlength={64}
					value={form?.email?.value}
					error={form?.email?.error}
					type="email"
				/>
				<Input
					id="name"
					icon="bx-user-circle"
					placeholder="John Doe"
					maxlength={50}
					minlength={1}
					value={form?.name?.value}
					error={form?.name?.error}
				/>
				<Input
					id="display-name"
					label="Username"
					icon="bx-at"
					placeholder="OGJohnDoe"
					maxlength={16}
					minlength={1}
					value={form?.displayName?.value}
					error={form?.displayName?.error}
				/>
				<Input
					id="password"
					icon="bx-lock"
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
