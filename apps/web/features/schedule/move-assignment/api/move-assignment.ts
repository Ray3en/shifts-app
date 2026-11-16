import { httpClient } from "@/shared/api/http-client";

export type MoveAssignmentInput = { id: string; employeeId: string; date: string };

export const moveAssignment = ({ id, employeeId, date }: MoveAssignmentInput) =>
  httpClient.patch(`/schedule/assignments/${id}`, { employeeId, date });
