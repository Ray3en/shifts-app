import { describe, expect, it } from "vitest";
import { formatHours, formatShiftRange, getShiftDuration, getShiftPalette } from "./shift-presentation";

describe("shift presentation", () => {
  it("formats table and template time ranges according to the design", () => {
    expect(formatShiftRange("08:00", "18:00", true)).toBe("08 - 18");
    expect(formatShiftRange("07:00", "15:00")).toBe("07:00 - 15:00");
  });

  it("calculates duration and formats hours", () => {
    expect(getShiftDuration("07:00", "15:00")).toBe(8);
    expect(formatHours(8)).toBe("8 ч");
  });

  it("uses template-specific text accents", () => {
    expect(getShiftPalette("День").accent).toBe("#814df5");
    expect(getShiftPalette("Своя смена")).toEqual({ background: "#e8edfc", text: "#101012", accent: "#5b7dec", border: "#afc1ff" });
  });
});
