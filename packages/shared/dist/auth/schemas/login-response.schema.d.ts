import { z } from "zod";
export declare const loginResponseSchema: z.ZodObject<{
    data: z.ZodObject<{
        accessToken: z.ZodString;
        user: z.ZodObject<{
            id: z.ZodUUID;
            login: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
