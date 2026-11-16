import { describe, expect, it } from "vitest";
import { getRangeDates, getScheduleRange, scheduleCellKey, toIsoDate } from "./date-range";

describe("schedule date business rules", () => {
  it("builds a Monday-to-Sunday week", () => {
    const range = getScheduleRange(new Date(2026, 10, 18), "week");
    expect(toIsoDate(range.from)).toBe("2026-11-16");
    expect(toIsoDate(range.to)).toBe("2026-11-22");
    expect(getRangeDates(range)).toHaveLength(7);
  });

  it("builds a complete calendar month", () => {
    const range = getScheduleRange(new Date(2026, 10, 18), "month");
    expect(toIsoDate(range.from)).toBe("2026-11-01");
    expect(toIsoDate(range.to)).toBe("2026-11-30");
    expect(getRangeDates(range)).toHaveLength(30);
  });

  it("creates a stable employee/date cell key", () => {
    expect(scheduleCellKey("employee-1", "2026-11-16")).toBe("employee-1:2026-11-16");
  });
});
