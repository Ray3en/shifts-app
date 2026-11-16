import { z } from "zod";
import { dateSchema, idSchema, timeSchema } from "./primitives.schema.js";

export const shiftAssignmentSchema = z.object({
  id: idSchema, employeeId: idSchema, date: dateSchema, startTime: timeSchema,
  endTime: timeSchema, templateId: idSchema.nullable(), templateName: z.string().nullable(), color: z.string(),
});
