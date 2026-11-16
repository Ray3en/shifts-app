import type { CreateAssignmentInput } from "@mono/shared";
import { httpClient } from "@/shared/api/http-client";

export const createAssignment = (input: CreateAssignmentInput) =>
  httpClient.post("/schedule/assignments", input);
