import type { UpdateAssignmentInput } from "@mono/shared";
import { httpClient } from "@/shared/api/http-client";

export type UpdateScheduleAssignmentInput = UpdateAssignmentInput & { id: string };

export const updateAssignment = ({ id, ...body }: UpdateScheduleAssignmentInput) =>
  httpClient.patch(`/schedule/assignments/${id}`, body);
