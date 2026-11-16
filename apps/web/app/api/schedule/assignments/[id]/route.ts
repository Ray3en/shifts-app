import { apiRequest, passThrough } from "@/shared/api";

export async function PATCH(request: Request, { params }: RouteContext<"/api/schedule/assignments/[id]">) {
  const { id } = await params;
  return passThrough(await apiRequest(`/schedule/assignments/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: await request.text() }));
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/schedule/assignments/[id]">) {
  const { id } = await params;
  return passThrough(await apiRequest(`/schedule/assignments/${id}`, { method: "DELETE" }));
}
