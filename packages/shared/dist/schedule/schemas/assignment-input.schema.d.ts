import { z } from "zod";
export declare const assignmentCellSchema: z.ZodObject<{
    employeeId: z.ZodUUID;
    date: z.ZodISODate;
}, z.core.$strip>;
export declare const createAssignmentSchema: z.ZodObject<{
    cells: z.ZodArray<z.ZodObject<{
        employeeId: z.ZodUUID;
        date: z.ZodISODate;
    }, z.core.$strip>>;
    templateId: z.ZodOptional<z.ZodUUID>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateAssignmentSchema: z.ZodObject<{
    employeeId: z.ZodOptional<z.ZodUUID>;
    date: z.ZodOptional<z.ZodISODate>;
    templateId: z.ZodOptional<z.ZodUUID>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
