import type { ChatData, Message } from "@types";
import type { Socket } from "socket.io-client";
import { isNullish } from "malachite-ui/predicate";
import { computed, ref } from "malachite-ui/utils";
import { io } from "socket.io-client";
import { onDestroy, onMount, tick } from "svelte";
import { parse } from "devalue";
import { chatContext } from "$lib/context";
import { writable } from "svelte/store";

export default function useChatRoom(initialToken: string, data: ChatData, isDOMMounted = false) {
	const connected = ref(false);
	const formAction = ref("/i/messages/" + data.recipient.id);
	const messages = ref(data.messages);
	const lastMessage = computed(messages, (messages) => messages.at(-1));
	const recipient = ref(data.recipient);
	const intersecting = writable(true);

	let socket: Socket | undefined;

	if (isDOMMounted) {
		connect(initialToken);
		const free = lastMessage.subscribe(handleScrollIntoView);
		onDestroy(() => {
			free();
			socket?.disconnect();
		})
	} else {
		onMount(() => {
			connect(initialToken);
			const free = lastMessage.subscribe(handleScrollIntoView);
			return () => {
				free();
				socket?.disconnect();
			};
		});
	}


	function connect(token: string) {
		socket = io("ws://localhost:3000", { auth: { token } });
		socket.on("connect", () => connected.set(true));
		socket.on("message", async (raw: string) => {
			messages.update((messages) => {
				messages.push(parse(raw) as Message);
				return messages;
			});
		});
		socket.on("disconnect", () => connected.set(false));
	}

	function emitMessage(text: string) {
		socket?.emit("message", text);
	}

	async function handleScrollIntoView(message: Message | undefined) {
		if (isNullish(message)) return;
		await tick();
		const element = document.getElementById(message.id);
		if (element) element.scrollIntoView();
	}

	function remount(token: string, data: ChatData) {
		if (token === initialToken) return;
		messages.set(data.messages);
		recipient.set(data.recipient);
		connected.set(false);
		socket?.disconnect();
		connect(token);
		initialToken = token;
		formAction.set("/i/messages/" + data.recipient.id);
	}

	chatContext.setContext({ connected, formAction, emitMessage, intersecting, messages, recipient });

	return remount;
}
