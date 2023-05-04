import type { Message, Recipient } from "@types";
import type { Writable } from "svelte/store";
import { useContext } from "malachite-ui/hooks";
import { isWritable } from "malachite-ui/predicate";

interface ChatContext {
	recipient: Recipient;
	messages: Message[];
}

export default useContext({
	component: "chat",
	predicate: (context): context is Writable<ChatContext> => isWritable(context)
});
