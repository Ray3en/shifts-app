import { scheduleQueryKeys } from "@/entities/schedule";
import { useQuery } from "@tanstack/react-query";
import { getSchedule } from "../api/get-schedule";

export function useSchedule(query: URLSearchParams | null) {
  return useQuery({
    queryKey: scheduleQueryKeys.range(query?.toString() ?? ""),
    queryFn: () => getSchedule(query!),
    enabled: query !== null,
  });
}
