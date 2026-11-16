import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ScheduleBoard from "./ScheduleBoard";

const employeeId = crypto.randomUUID();
const templates = [
  { id: crypto.randomUUID(), name: "Утро", startTime: "07:00", endTime: "15:00", color: "#9eb0ff" },
  { id: crypto.randomUUID(), name: "День", startTime: "10:00", endTime: "18:00", color: "#c89cff" },
  { id: crypto.randomUUID(), name: "Вечер", startTime: "15:00", endTime: "23:00", color: "#8edfdc" },
];

vi.mock("@/features/schedule/load-schedule", () => ({
  useSchedule: () => ({
    data: {
      employees: [{ id: employeeId, fullName: "Кузнецова Алина", role: "агент", weeklyHours: 24, color: "#fff" }],
      templates,
      assignments: [{ id: crypto.randomUUID(), employeeId, date: "2026-11-16", startTime: "07:00", endTime: "15:00", templateId: templates[0].id, templateName: "Утро", color: "#9eb0ff" }],
      publishedAt: null,
    },
    isLoading: false,
    isError: false,
  }),
}));
vi.mock("@/features/schedule/create-assignment", () => ({ useCreateAssignment: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("@/features/schedule/delete-assignment", () => ({ useDeleteAssignment: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("@/features/schedule/publish-schedule", () => ({ usePublishSchedule: () => ({ mutate: vi.fn(), isPending: false }) }));
vi.mock("@/features/schedule/move-assignment", () => ({ useMoveAssignment: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("@/features/schedule/apply-assignment-template", () => ({ useApplyAssignmentTemplate: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("@/features/schedule/update-assignment", () => ({ useUpdateAssignment: () => ({ mutateAsync: vi.fn() }) }));
vi.mock("@/features/schedule/select-assignment-cells", () => ({
  useAssignmentSelection: () => ({ selected: new Set(), toggle: vi.fn(), cells: () => [], clear: vi.fn() }),
}));

describe("ScheduleBoard", () => {
  it("renders employees and all shift templates returned by the API", async () => {
    render(<ScheduleBoard />);
    expect(screen.getByText("Кузнецова Алина")).toBeInTheDocument();
    expect(screen.getByText("Утро")).toBeInTheDocument();
    expect(screen.getByText("День")).toBeInTheDocument();
    expect(screen.getByText("Вечер")).toBeInTheDocument();
    expect(screen.getByText("07:00 - 15:00 · 8 ч")).toBeInTheDocument();
    const cell = await screen.findByRole("button", { name: /Кузнецова Алина, 2026-11-16, смена/ });
    expect(within(cell).getByText("07 - 15").parentElement).toHaveStyle({ color: "rgb(16, 16, 18)" });
    expect(within(cell).getByText("8 ч", { selector: "span" })).toHaveStyle({ color: "rgb(91, 125, 236)" });
  });

  it("does not render a dashed placeholder border over an assigned shift", async () => {
    render(<ScheduleBoard />);
    const cell = await screen.findByRole("button", { name: /Кузнецова Алина, 2026-11-16, смена/ });
    expect(cell).not.toHaveClass("border-dashed");
    expect(cell).toHaveClass("border-transparent");
    expect(cell.firstElementChild).toHaveClass("w-full", "h-full");
  });

  it("renders weekday above the date in month view", async () => {
    const { container } = render(<ScheduleBoard />);
    await screen.findByRole("button", { name: /Кузнецова Алина, 2026-11-16/ });
    fireEvent.click(screen.getByRole("tab", { name: "Месяц" }));
    const firstDateHeader = container.querySelector('[data-testid="calendar-header"] > div:nth-child(2)');
    expect(firstDateHeader?.querySelectorAll("span")).toHaveLength(2);
  });

  it("keeps the calendar header and coverage visible while scrolling", () => {
    const { container } = render(<ScheduleBoard />);
    expect(container.querySelector('[data-testid="calendar-header"]')).toHaveClass("sticky", "top-0");
    expect(container.querySelector('[data-testid="calendar-coverage"]')).toHaveClass("sticky", "bottom-0");
  });
});
