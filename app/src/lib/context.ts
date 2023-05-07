import type { Writable } from "svelte/store";
import type { ChatContext, UserProfile } from "@types";
import { useContext } from "malachite-ui/hooks";
import { isFunction, isInterface, isRef, isStore, isWritable } from "malachite-ui/predicate";

export const userProfileContext = useContext({
	component: "user-profile",
	predicate: (context): context is Writable<UserProfile> => isWritable(context)
});

export const chatContext = useContext({
	component: "chat",
	predicate: (context): context is ChatContext =>
		isInterface<ChatContext>(context, {
			connected: isStore,
			messages: isRef,
			recipient: isRef,
			emitMessage: isFunction
		})
});
