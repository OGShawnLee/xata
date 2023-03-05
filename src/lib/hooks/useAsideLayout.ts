import { writable } from "svelte/store";
import { isArray } from "malachite-ui/predicate";

interface AsideLayout {
	type: LayoutType;
	data: {
		relevantPeople: UserObject[];
	};
}

type LayoutType = "NONE" | "RELEVANT-PEOPLE";

export default function useAsideLayout() {
	const { subscribe, update } = writable<AsideLayout>({
		type: "NONE",
		data: { relevantPeople: [] }
	});

	function set(this: void, type: "NONE", data: undefined): void;
	function set(this: void, type: "RELEVANT-PEOPLE", data: UserObject[]): void;

	function set(this: void, type: LayoutType, data: undefined | UserObject[]) {
		if (type === "RELEVANT-PEOPLE" && isArray(data)) {
			update((state) => {
				state.type = type;
				state.data.relevantPeople = data;
				return state;
			});
		} else {
			update((state) => {
				state.type = type;
				return state;
			});
		}
	}

	return { set, subscribe };
}
