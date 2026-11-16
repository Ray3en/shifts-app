import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CalendarViewSwitch } from "./CalendarViewSwitch";

describe("CalendarViewSwitch", () => {
  it("announces the active view and changes it", () => {
    const onChange = vi.fn();
    render(<CalendarViewSwitch value="week" onChange={onChange} />);
    expect(screen.getByRole("tab", { name: "Неделя" })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: "Месяц" }));
    expect(onChange).toHaveBeenCalledWith("month");
  });
});
