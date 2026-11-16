import { z } from "zod";
import { idSchema } from "./primitives.schema.js";
export const employeeSchema = z.object({
    id: idSchema,
    fullName: z.string(),
    role: z.string(),
    weeklyHours: z.number().int().nonnegative(),
    color: z.string(),
});
