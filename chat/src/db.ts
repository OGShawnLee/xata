import { config as configureEnvVariables } from "dotenv";
import { useAwait } from "./hooks";
import { getXataClient } from "./xata";

configureEnvVariables();

const client = getXataClient();

export function createMessage(
  cuid: string,
  chat: string,
  draft: boolean,
  text: string
) {
  return useAwait<Message>(async () => {
    if (draft) {
      const { results } = await client.transactions.run([
        {
          insert: {
            table: "message",
            record: { chat: chat, user: cuid, text },
          },
        },
        { update: { table: "chat", id: chat, fields: { draft: false } } },
      ]);
      return { id: results[0].id, createdAt: new Date(), user: cuid, text };
    }

    const message = await client.db.message.create({ chat, user: cuid, text });
    return {
      id: message.id,
      createdAt: message.createdAt,
      user: message.user?.id,
      text,
    };
  });
}

export function updateChatLastMessage(chat: string, mid: string) {
  return useAwait(() => {
    return client.db.chat.update(chat, { lastMessage: mid });
  });
}

interface Message {
  id: string;
  createdAt: Date;
  user: string | undefined;
  text: string | undefined | null;
}
