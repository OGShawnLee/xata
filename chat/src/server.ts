import { Server } from "socket.io";
import { createServer } from "http";
import { stringify } from "devalue";
import { getChatTokenState } from "./auth";
import { createMessage, updateChatLastMessage } from "./db";

const server = createServer();
const app = new Server(server, {
  cors: { origin: "*" },
});

app.on("connection", async (socket) => {
  const auth = getChatTokenState(socket.handshake.auth.token);
  if (auth.failed) return socket.emit("error", 401);

  const { chat, cuid, draft } = auth.data;
  let isDraftChat = draft;

  await socket.join(chat);

  socket.on("message", async (text: unknown) => {
    if (typeof text !== "string" || isWhitespace(text))
      return socket.emit("error", 400);

    const message = await createMessage(cuid, chat, isDraftChat, text);
    if (message.failed) return socket.emit("error", 500);

    isDraftChat = false;

    app.to(chat).emit("message", stringify(message.data));
    updateChatLastMessage(chat, message.data.id);
  });
});

server.listen(3000, "localhost", () => {
  console.log("Port: 3000");
});

function isWhitespace(value: string) {
  return value.replace(/\s+/g, "").length === 0;
}
