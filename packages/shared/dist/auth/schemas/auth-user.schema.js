import { z } from "zod";
export const authUserSchema = z.object({ id: z.uuid(), login: z.string() });
