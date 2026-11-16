import { scheduleQueryKeys } from "@/entities/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyAssignmentTemplate } from "../api/apply-assignment-template";

export function useApplyAssignmentTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyAssignmentTemplate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all }),
  });
}
