import { writable } from "svelte/store";

interface State {
	event: "NONE" | "QUOTE" | "REPLY";
	open: boolean;
	data: {
		quoteTweet: QuoteTweetObject | undefined;
		replyTweet: TweetObject | undefined;
	};
}

export default function useComposeDialog() {
	const { set, subscribe, update } = writable<State>({
		event: "NONE",
		open: false,
		data: { quoteTweet: undefined, replyTweet: undefined }
	});

	function change(this: void, value: State) {
		if (value.open) set(value);
		else {
			update((state) => {
				state.data.quoteTweet = undefined;
				state.open = false;
				return state;
			});
		}
	}

	function trigger(this: void, type: "NONE"): void;
	function trigger(this: void, type: "QUOTE", data: QuoteTweetObject): void;
	function trigger(this: void, type: "REPLY", data: TweetObject): void;

	function trigger(
		this: void,
		type: "NONE" | "QUOTE" | "REPLY",
		data?: QuoteTweetObject | TweetObject
	) {
		update((state) => {
			state.event = type;
			if (type === "NONE") {
				state.open = false;
				state.data.quoteTweet = undefined;
			} else if (data) {
				state.open = true;
				if (type === "QUOTE") state.data.quoteTweet = data;
				else state.data.replyTweet = data as TweetObject;
			}
			return state;
		});
	}

	return { set: change, subscribe, trigger };
}
