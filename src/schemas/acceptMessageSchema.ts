import { z } from "zod";

export const acceptMessageSchema = z.object({
  accceptMessages: z.boolean(),
});
