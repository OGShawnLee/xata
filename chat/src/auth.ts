import { verify } from "jsonwebtoken";
import { useCatch } from "./hooks";
import { tokenSchema } from "./schema";
import { config as configureEnvVariables } from "dotenv";

configureEnvVariables();

export function getChatTokenState(token: unknown) {
  return useCatch(() => {
    if (typeof token !== "string") throw TypeError("Invalid Token Type");
    const payload = verify(token, process.env.CHAT_TOKEN);
    return tokenSchema.parse(payload);
  });
}
