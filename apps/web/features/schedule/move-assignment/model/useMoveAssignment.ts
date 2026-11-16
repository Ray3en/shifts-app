import { scheduleQueryKeys } from "@/entities/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { moveAssignment } from "../api/move-assignment";

export function useMoveAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: moveAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all }),
  });
}
