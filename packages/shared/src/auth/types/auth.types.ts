import type { z } from "zod";
import type { ApiResponse } from "../../common/index.js";
import type { authUserSchema } from "../schemas/auth-user.schema.js";
import type { loginSchema } from "../schemas/login.schema.js";
import type { loginResponseSchema } from "../schemas/login-response.schema.js";

export type LoginInput = z.infer<typeof loginSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type CurrentUserResponse = ApiResponse<AuthUser>;
