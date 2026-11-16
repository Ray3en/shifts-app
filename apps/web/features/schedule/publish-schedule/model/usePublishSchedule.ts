import { scheduleQueryKeys } from "@/entities/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishSchedule } from "../api/publish-schedule";

export function usePublishSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishSchedule,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all }),
  });
}
