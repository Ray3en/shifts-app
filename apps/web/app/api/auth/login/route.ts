import { loginResponseSchema, loginSchema } from "@mono/shared";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiUrl = process.env.INTERNAL_API_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Проверьте логин и пароль" }, { status: 400 });
  }

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsed.data),
    cache: "no-store",
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return NextResponse.json(
      { message: response.status === 401 ? "Неверный логин или пароль" : "Сервис авторизации недоступен" },
      { status: response.status },
    );
  }

  const result = loginResponseSchema.parse(body);
  const cookieStore = await cookies();
  cookieStore.set("access_token", result.data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ data: { user: result.data.user } });
}
