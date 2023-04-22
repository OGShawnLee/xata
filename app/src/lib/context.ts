import type { Writable } from "svelte/store";
import type { UserProfile } from "@types";
import { useContext } from "malachite-ui/hooks";
import { isWritable } from "malachite-ui/predicate";

export const userProfileContext = useContext({
	component: "user-profile",
	predicate: (context): context is Writable<UserProfile> => isWritable(context)
});
