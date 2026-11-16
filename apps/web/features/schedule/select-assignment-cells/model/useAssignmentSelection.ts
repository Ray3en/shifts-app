import { scheduleCellKey } from "@/entities/schedule";
import { useState } from "react";

export function useAssignmentSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (employeeId: string, date: string) => setSelected((current) => {
    const next = new Set(current);
    const key = scheduleCellKey(employeeId, date);
    if (next.has(key)) next.delete(key); else next.add(key);
    return next;
  });
  const cells = () => Array.from(selected).map((key) => {
    const [employeeId, date] = key.split(":");
    return { employeeId, date };
  });
  const clear = () => setSelected(new Set());
  return { selected, toggle, cells, clear };
}
