import { z } from "zod";
export declare const shiftTemplateSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
    color: z.ZodString;
}, z.core.$strip>;
