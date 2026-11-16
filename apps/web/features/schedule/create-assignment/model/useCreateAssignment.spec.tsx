import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAssignment } from "../api/create-assignment";
import { useCreateAssignment } from "./useCreateAssignment";

vi.mock("../api/create-assignment", () => ({ createAssignment: vi.fn() }));

describe("create assignment mutation", () => {
  beforeEach(() => vi.mocked(createAssignment).mockReset());

  it("sends typed data and invalidates schedule cache", async () => {
    vi.mocked(createAssignment).mockResolvedValue({} as never);
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: PropsWithChildren) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    const { result } = renderHook(() => useCreateAssignment(), { wrapper });
    const input = { cells: [{ employeeId: crypto.randomUUID(), date: "2026-11-16" }], startTime: "09:00", endTime: "17:00" };

    await act(() => result.current.mutateAsync(input));

    expect(createAssignment).toHaveBeenCalledWith(input, expect.anything());
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["schedule"] });
  });
});
