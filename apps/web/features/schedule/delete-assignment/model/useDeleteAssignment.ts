import { scheduleQueryKeys } from "@/entities/schedule";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAssignment } from "../api/delete-assignment";

export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleQueryKeys.all }),
  });
}
