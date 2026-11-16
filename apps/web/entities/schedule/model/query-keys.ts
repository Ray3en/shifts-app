export const scheduleQueryKeys = {
  all: ["schedule"] as const,
  range: (query: string) => ["schedule", query] as const,
};
