import { describe, expect, it, vi } from "vitest";
import { httpClient } from "@/shared/api/http-client";
import { getSchedule } from "./get-schedule";

vi.mock("@/shared/api/http-client", () => ({ httpClient: { get: vi.fn() } }));

describe("schedule API contract", () => {
  it("accepts and returns employees with time templates", async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: {
        data: {
          employees: [{ id: crypto.randomUUID(), fullName: "Кузнецова Алина", role: "агент", weeklyHours: 24, color: "#fff" }],
          templates: [
            { id: crypto.randomUUID(), name: "Утро", startTime: "07:00", endTime: "15:00", color: "#9eb0ff" },
            { id: crypto.randomUUID(), name: "День", startTime: "10:00", endTime: "18:00", color: "#c89cff" },
            { id: crypto.randomUUID(), name: "Вечер", startTime: "15:00", endTime: "23:00", color: "#8edfdc" },
          ],
          assignments: [],
          publishedAt: null,
        },
      },
    });

    const result = await getSchedule(new URLSearchParams({ from: "2026-11-16", to: "2026-11-22" }));

    expect(result.employees.map((employee) => employee.fullName)).toContain("Кузнецова Алина");
    expect(result.templates.map((template) => template.name)).toEqual(["Утро", "День", "Вечер"]);
  });

  it("rejects database-style seconds so contract regressions stay visible", async () => {
    vi.mocked(httpClient.get).mockResolvedValue({
      data: { data: { employees: [], templates: [{ id: crypto.randomUUID(), name: "Утро", startTime: "07:00:00", endTime: "15:00:00", color: "#fff" }], assignments: [], publishedAt: null } },
    });
    await expect(getSchedule(new URLSearchParams())).rejects.toThrow();
  });
});
