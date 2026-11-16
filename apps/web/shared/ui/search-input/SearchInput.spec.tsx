import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchInput } from "./SearchInput";

describe("SearchInput", () => {
  it("shows the clear action only for a non-empty value", () => {
    const { rerender } = render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Очистить поиск" })).not.toBeInTheDocument();

    rerender(<SearchInput value="Алина" onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Очистить поиск" })).toBeInTheDocument();
  });

  it("calls onClear from the clear button", () => {
    const onClear = vi.fn();
    render(<SearchInput value="Алина" onChange={vi.fn()} onClear={onClear} variant="white" />);
    fireEvent.click(screen.getByRole("button", { name: "Очистить поиск" }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});
