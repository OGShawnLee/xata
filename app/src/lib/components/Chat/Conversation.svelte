<script lang="ts" context="module">
	import type { Message } from "@types";
	import { isEmpty } from "malachite-ui/predicate";

	interface SeriesOfMessages {
		id: string;
		messages: Message[];
		startedAt: Date;
		user: string | undefined;
	}

	function createSeriesOfMessages(messages: Message[]) {
		if (isEmpty(messages)) return [];
		const series: SeriesOfMessages[] = [
			{
				id: messages[0].id,
				messages: [],
				startedAt: messages[0].createdAt,
				user: messages[0].user
			}
		];
		return messages.reduce((series, message) => {
			const currentSeries = series[series.length - 1];
			const currentSeriesSeconds = Math.floor(currentSeries.startedAt.getTime() / 1000);
			const messageSeconds = Math.floor(message.createdAt.getTime() / 1000);
			const difference = messageSeconds - currentSeriesSeconds;
			if (difference > 60 || message.user !== currentSeries.user) {
				series.push({
					id: message.id,
					messages: [message],
					startedAt: message.createdAt,
					user: message.user
				});
			} else {
				currentSeries.messages.push(message);
			}
			return series;
		}, series);
	}
</script>

<script lang="ts">
	import ChatMessage from "./Message.svelte";
	import ChatRecipient from "./Recipient.svelte";
	import Time from "../Time.svelte";
	import { chatContext } from "$lib/context";
	import { currentUser } from "$lib/state";

	export let isChatHead = false;

	const { messages } = chatContext.getContext();

	$: seriesOfMessages = createSeriesOfMessages($messages);
</script>

<div class="flex flex-col gap-3 {isChatHead ? 'pb-4' : 'pr-4 overflow-y-auto'}">
	<ChatRecipient {isChatHead} />
	<div class="pl-6 | flex flex-col gap-6" class:pr-3={isChatHead}>
		{#each seriesOfMessages as { id, messages, startedAt, user } (id)}
			<div class="grid gap-1.25">
				<ul class="flex flex-col gap-3">
					{#each messages as message (message.id)}
						<ChatMessage lighter {message} />
					{/each}
				</ul>
				<Time isMessage isCurrentUser={user === $currentUser?.id} createdAt={startedAt} />
			</div>
		{/each}
	</div>
</div>
