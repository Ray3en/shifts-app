import { z } from "zod";
import { dateSchema, idSchema, timeSchema } from "./primitives.schema.js";

export const assignmentCellSchema = z.object({ employeeId: idSchema, date: dateSchema });
export const createAssignmentSchema = z.object({
  cells: z.array(assignmentCellSchema).min(1),
  templateId: idSchema.optional(),
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
}).refine((value) => value.templateId || (value.startTime && value.endTime), {
  message: "Выберите шаблон или укажите время смены",
});
export const updateAssignmentSchema = z.object({
  employeeId: idSchema.optional(),
  date: dateSchema.optional(),
  templateId: idSchema.optional(),
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
});
