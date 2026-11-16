import { apiRequest, passThrough } from "@/shared/api";

export async function GET(request: Request) {
  return passThrough(await apiRequest(`/schedule${new URL(request.url).search}`));
}
