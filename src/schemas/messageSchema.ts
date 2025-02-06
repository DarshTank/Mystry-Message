import { z } from "zod";

export const MessageSchema = z.object({
  content: z
    .string()
    .min(10, "Message must be at least 10 characters long")
    .max(300, "Message must not be loger than 300 characters long"),
});
