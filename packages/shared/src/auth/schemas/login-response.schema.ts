import { z } from "zod";
import { authUserSchema } from "./auth-user.schema.js";

export const loginResponseSchema = z.object({
  data: z.object({ accessToken: z.string(), user: authUserSchema }),
});
