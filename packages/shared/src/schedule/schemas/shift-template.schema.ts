import { z } from "zod";
import { idSchema, timeSchema } from "./primitives.schema.js";

export const shiftTemplateSchema = z.object({
  id: idSchema, name: z.string(), startTime: timeSchema, endTime: timeSchema, color: z.string(),
});
