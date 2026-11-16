import { scheduleQueryKeys } from "@/entities/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssignment } from "../api/create-assignment";

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all }),
  });
}
