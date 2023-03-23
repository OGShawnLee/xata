import type { Tweet } from "@types";
import type { Writable } from "svelte/store";
import { isWritable } from "malachite-ui/predicate";
import { useContext } from "malachite-ui/hooks";

export default useContext({
	component: "tweet",
	predicate: (value): value is Writable<Tweet> => {
		return isWritable(value);
	}
});
