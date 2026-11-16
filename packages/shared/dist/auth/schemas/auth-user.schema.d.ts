import { z } from "zod";
export declare const authUserSchema: z.ZodObject<{
    id: z.ZodUUID;
    login: z.ZodString;
}, z.core.$strip>;
