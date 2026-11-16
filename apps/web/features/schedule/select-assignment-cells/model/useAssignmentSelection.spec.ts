import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useAssignmentSelection } from "./useAssignmentSelection";

describe("assignment cell selection", () => {
  it("selects, unselects and serializes cells", () => {
    const { result } = renderHook(() => useAssignmentSelection());
    act(() => result.current.toggle("employee-1", "2026-11-16"));
    expect(result.current.selected.has("employee-1:2026-11-16")).toBe(true);
    expect(result.current.cells()).toEqual([{ employeeId: "employee-1", date: "2026-11-16" }]);

    act(() => result.current.toggle("employee-1", "2026-11-16"));
    expect(result.current.selected.size).toBe(0);
  });

  it("clears selected cells", () => {
    const { result } = renderHook(() => useAssignmentSelection());
    act(() => result.current.toggle("employee-1", "2026-11-16"));
    act(() => result.current.clear());
    expect(result.current.selected.size).toBe(0);
  });
});
