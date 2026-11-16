import type { LoginInput } from "@mono/shared";
import { httpClient } from "@/shared/api/http-client";

export async function login(values: LoginInput) {
  return httpClient.post("/auth/login", values);
}
