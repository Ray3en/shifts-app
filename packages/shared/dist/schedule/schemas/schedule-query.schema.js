import { z } from "zod";
import { dateSchema } from "./primitives.schema.js";
export const scheduleQuerySchema = z.object({
    from: dateSchema, to: dateSchema, search: z.string().trim().optional().default(""),
});
