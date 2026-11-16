import type { z } from "zod";
import type { employeeSchema } from "../schemas/employee.schema.js";
import type { shiftAssignmentSchema } from "../schemas/shift-assignment.schema.js";
import type { shiftTemplateSchema } from "../schemas/shift-template.schema.js";

export type Employee = z.infer<typeof employeeSchema>;
export type ShiftTemplate = z.infer<typeof shiftTemplateSchema>;
export type ShiftAssignment = z.infer<typeof shiftAssignmentSchema>;
