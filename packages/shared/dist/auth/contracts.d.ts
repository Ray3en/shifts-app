import { z } from "zod";
import type { ApiResponse } from "../common/api.js";
export declare const loginSchema: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export declare const authUserSchema: z.ZodObject<{
    id: z.ZodUUID;
    login: z.ZodString;
}, z.core.$strip>;
export type AuthUser = z.infer<typeof authUserSchema>;
export declare const loginResponseSchema: z.ZodObject<{
    data: z.ZodObject<{
        accessToken: z.ZodString;
        user: z.ZodObject<{
            id: z.ZodUUID;
            login: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type CurrentUserResponse = ApiResponse<AuthUser>;
