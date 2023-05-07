import { z } from "zod";

export const tokenSchema = z.object({
  chat: z.string(),
  cuid: z.string(),
  draft: z.boolean(),
});
