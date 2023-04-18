import { readonly, ref, watch } from "malachite-ui/utils";

type WarningEvent = { type: "UNFOLLOW"; displayName: string; onContinue: () => void };

export default function useWarningDialog() {
	const open = ref(false);
	const state = ref<WarningEvent | undefined>(undefined);

	function dispatch(event: WarningEvent) {
		state.set(event);
		open.set(true);
	}

	watch(open, (isOpen) => {
		if (isOpen === false) state.set(undefined);
	});

	return { open, state: readonly(state), dispatch };
}
