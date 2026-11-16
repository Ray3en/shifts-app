import { httpClient } from "@/shared/api/http-client";

export const publishSchedule = () => httpClient.post("/schedule/publish");
