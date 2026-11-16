import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebouncedValue } from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  it("updates only after the delay and collapses rapid changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 500), { initialProps: { value: "" } });
    rerender({ value: "Куз" });
    rerender({ value: "Кузнецова" });
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe("");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe("Кузнецова");
    vi.useRealTimers();
  });
});
