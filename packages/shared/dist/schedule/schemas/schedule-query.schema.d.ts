import { z } from "zod";
export declare const scheduleQuerySchema: z.ZodObject<{
    from: z.ZodISODate;
    to: z.ZodISODate;
    search: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
