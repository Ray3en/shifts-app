import { z } from "zod";
import { employeeSchema } from "./employee.schema.js";
import { shiftAssignmentSchema } from "./shift-assignment.schema.js";
import { shiftTemplateSchema } from "./shift-template.schema.js";
export const scheduleResponseSchema = z.object({
    data: z.object({
        employees: z.array(employeeSchema),
        templates: z.array(shiftTemplateSchema),
        assignments: z.array(shiftAssignmentSchema),
        publishedAt: z.iso.datetime().nullable(),
    }),
});
