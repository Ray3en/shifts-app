import { z } from "zod";
export declare const dateSchema: z.ZodISODate;
export declare const idSchema: z.ZodUUID;
export declare const timeSchema: z.ZodString;
export declare const employeeSchema: z.ZodObject<{
    id: z.ZodUUID;
    fullName: z.ZodString;
    role: z.ZodString;
    weeklyHours: z.ZodNumber;
    color: z.ZodString;
}, z.core.$strip>;
export type Employee = z.infer<typeof employeeSchema>;
export declare const shiftTemplateSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    color: z.ZodString;
}, z.core.$strip>;
export type ShiftTemplate = z.infer<typeof shiftTemplateSchema>;
export declare const shiftAssignmentSchema: z.ZodObject<{
    id: z.ZodUUID;
    employeeId: z.ZodUUID;
    date: z.ZodISODate;
    startTime: z.ZodString;
    endTime: z.ZodString;
    templateId: z.ZodNullable<z.ZodUUID>;
    templateName: z.ZodNullable<z.ZodString>;
    color: z.ZodString;
}, z.core.$strip>;
export type ShiftAssignment = z.infer<typeof shiftAssignmentSchema>;
export declare const scheduleQuerySchema: z.ZodObject<{
    from: z.ZodISODate;
    to: z.ZodISODate;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type ScheduleQuery = z.infer<typeof scheduleQuerySchema>;
export declare const scheduleResponseSchema: z.ZodObject<{
    data: z.ZodObject<{
        employees: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            fullName: z.ZodString;
            role: z.ZodString;
            weeklyHours: z.ZodNumber;
            color: z.ZodString;
        }, z.core.$strip>>;
        templates: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            name: z.ZodString;
            startTime: z.ZodString;
            endTime: z.ZodString;
            color: z.ZodString;
        }, z.core.$strip>>;
        assignments: z.ZodArray<z.ZodObject<{
            id: z.ZodUUID;
            employeeId: z.ZodUUID;
            date: z.ZodISODate;
            startTime: z.ZodString;
            endTime: z.ZodString;
            templateId: z.ZodNullable<z.ZodUUID>;
            templateName: z.ZodNullable<z.ZodString>;
            color: z.ZodString;
        }, z.core.$strip>>;
        publishedAt: z.ZodNullable<z.ZodISODateTime>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ScheduleResponse = z.infer<typeof scheduleResponseSchema>;
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
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export declare const updateAssignmentSchema: z.ZodObject<{
    templateId: z.ZodOptional<z.ZodUUID>;
    startTime: z.ZodOptional<z.ZodString>;
    endTime: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
export declare const assignmentMutationResponseSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        employeeId: z.ZodUUID;
        date: z.ZodISODate;
        startTime: z.ZodString;
        endTime: z.ZodString;
        templateId: z.ZodNullable<z.ZodUUID>;
        templateName: z.ZodNullable<z.ZodString>;
        color: z.ZodString;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type AssignmentMutationResponse = z.infer<typeof assignmentMutationResponseSchema>;
