import { z } from "zod";
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
