import { httpClient } from "@/shared/api/http-client";

export const deleteAssignment = (id: string) => httpClient.delete(`/schedule/assignments/${id}`);
