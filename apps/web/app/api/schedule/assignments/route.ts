import { apiRequest, passThrough } from "@/shared/api";

export async function POST(request: Request) {
  return passThrough(await apiRequest("/schedule/assignments", {
    method: "POST", headers: { "content-type": "application/json" }, body: await request.text(),
  }));
}
