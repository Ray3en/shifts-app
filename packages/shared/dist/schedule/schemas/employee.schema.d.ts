import { z } from "zod";
export declare const employeeSchema: z.ZodObject<{
    id: z.ZodUUID;
    fullName: z.ZodString;
    role: z.ZodString;
    weeklyHours: z.ZodNumber;
    color: z.ZodString;
}, z.core.$strip>;
