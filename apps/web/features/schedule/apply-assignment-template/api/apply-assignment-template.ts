import { httpClient } from "@/shared/api/http-client";

export type ApplyAssignmentTemplateInput = { id: string; templateId: string };

export const applyAssignmentTemplate = ({ id, templateId }: ApplyAssignmentTemplateInput) =>
  httpClient.patch(`/schedule/assignments/${id}`, { templateId });
