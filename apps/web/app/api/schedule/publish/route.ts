import { apiRequest, passThrough } from "@/shared/api";

export async function POST() {
  return passThrough(await apiRequest("/schedule/publish", { method: "POST" }));
}
