import { NextRequest, NextResponse } from "next/server";

const apiUrl = process.env.INTERNAL_API_URL ?? "http://localhost:3001";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const response = await fetch(`${apiUrl}/auth/me`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (response.ok) return NextResponse.next();
  } catch {
    // Invalid or unavailable sessions are handled as unauthenticated.
  }

  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete("access_token");
  return response;
}

export const config = { matcher: ["/shifts/:path*"] };
