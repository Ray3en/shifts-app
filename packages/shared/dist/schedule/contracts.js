import { z } from "zod";
export const dateSchema = z.iso.date();
export const idSchema = z.uuid();
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Время должно быть в формате ЧЧ:ММ");
export const employeeSchema = z.object({ id: idSchema, fullName: z.string(), role: z.string(), weeklyHours: z.number().int().nonnegative(), color: z.string() });
export const shiftTemplateSchema = z.object({ id: idSchema, name: z.string(), startTime: timeSchema, endTime: timeSchema, color: z.string() });
export const shiftAssignmentSchema = z.object({
    id: idSchema, employeeId: idSchema, date: dateSchema, startTime: timeSchema,
    endTime: timeSchema, templateId: idSchema.nullable(), templateName: z.string().nullable(), color: z.string(),
});
export const scheduleQuerySchema = z.object({ from: dateSchema, to: dateSchema, search: z.string().trim().optional().default("") });
export const scheduleResponseSchema = z.object({
    data: z.object({ employees: z.array(employeeSchema), templates: z.array(shiftTemplateSchema), assignments: z.array(shiftAssignmentSchema), publishedAt: z.iso.datetime().nullable() }),
});
export const assignmentCellSchema = z.object({ employeeId: idSchema, date: dateSchema });
export const createAssignmentSchema = z.object({
    cells: z.array(assignmentCellSchema).min(1), templateId: idSchema.optional(), startTime: timeSchema.optional(), endTime: timeSchema.optional(),
}).refine((value) => value.templateId || (value.startTime && value.endTime), { message: "Выберите шаблон или укажите время смены" });
export const updateAssignmentSchema = z.object({ templateId: idSchema.optional(), startTime: timeSchema.optional(), endTime: timeSchema.optional() });
export const assignmentMutationResponseSchema = z.object({ data: z.array(shiftAssignmentSchema) });
