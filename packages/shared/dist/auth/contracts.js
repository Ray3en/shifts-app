import { z } from "zod";
export const loginSchema = z.object({
    login: z.string().trim().min(1, "Введите логин"),
    password: z.string().min(1, "Введите пароль"),
});
export const authUserSchema = z.object({ id: z.uuid(), login: z.string() });
export const loginResponseSchema = z.object({
    data: z.object({ accessToken: z.string(), user: authUserSchema }),
});
