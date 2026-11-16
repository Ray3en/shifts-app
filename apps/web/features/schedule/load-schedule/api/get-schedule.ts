import { scheduleResponseSchema } from "@/entities/schedule";
import { httpClient } from "@/shared/api/http-client";

export async function getSchedule(query: URLSearchParams) {
  const response = await httpClient.get(`/schedule?${query}`);
  return scheduleResponseSchema.parse(response.data).data;
}
