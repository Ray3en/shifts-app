import { cookies } from "next/headers";

const apiUrl = process.env.INTERNAL_API_URL ?? "http://localhost:3001";

export async function apiRequest(path: string, init?: RequestInit) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) return new Response(null, { status: 401 });
  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: { ...init?.headers, authorization: `Bearer ${token}` },
    cache: "no-store",
  });
}

export async function passThrough(response: Response) {
  if (response.status === 204) return new Response(null, { status: 204 });
  return Response.json(await response.json(), { status: response.status });
}
