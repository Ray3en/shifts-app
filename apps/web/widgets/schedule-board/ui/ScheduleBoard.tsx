"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateAssignmentInput } from "@mono/shared";
import { formatHours, formatShiftRange, getRangeDates, getScheduleRange, getShiftDuration, getShiftPalette, scheduleCellKey, timeSchema, toIsoDate, type ScheduleViewMode, type ShiftAssignment, type ShiftTemplate } from "@/entities/schedule";
import { useCreateAssignment } from "@/features/schedule/create-assignment";
import { useDeleteAssignment } from "@/features/schedule/delete-assignment";
import { useSchedule } from "@/features/schedule/load-schedule";
import { usePublishSchedule } from "@/features/schedule/publish-schedule";
import { useMoveAssignment } from "@/features/schedule/move-assignment";
import { useApplyAssignmentTemplate } from "@/features/schedule/apply-assignment-template";
import { useUpdateAssignment } from "@/features/schedule/update-assignment";
import { useAssignmentSelection } from "@/features/schedule/select-assignment-cells";
import { CalendarViewSwitch } from "@/features/schedule/change-calendar-view";
import { useDebouncedValue } from "@/shared/lib/hooks";
import { SearchInput } from "@/shared/ui/search-input";
import { DatePicker } from "@/shared/ui/date-picker";
import gridIcon from "@/shared/assets/icons/grid.svg";
import plusIcon from "@/shared/assets/icons/plus.svg";
import removeIcon from "@/shared/assets/icons/remove.svg";
import xIcon from "@/shared/assets/icons/x.svg";
import Image from "next/image";
import { useEffect, useMemo, useState, type DragEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ScheduleTableSkeleton } from "./ScheduleTableSkeleton";

const customSchema = z.object({ startTime: timeSchema, endTime: timeSchema });
type CustomInput = z.infer<typeof customSchema>;
type Toast = { text: string; tone: "success" | "error" };

function setRoundedDragPreview(event: DragEvent<HTMLElement>, source: HTMLElement) {
  const bounds = source.getBoundingClientRect();
  const preview = document.createElement("div");
  const clone = source.cloneNode(true) as HTMLElement;
  preview.style.cssText = `position:fixed;left:-10000px;top:-10000px;width:${bounds.width}px;height:${bounds.height}px;border-radius:8px;overflow:hidden;opacity:.92;pointer-events:none`;
  clone.style.width = `${bounds.width}px`;
  clone.style.height = `${bounds.height}px`;
  clone.style.margin = "0";
  clone.style.borderRadius = "8px";
  clone.style.overflow = "hidden";
  preview.append(clone);
  document.body.append(preview);
  event.dataTransfer.setDragImage(preview, bounds.width / 2, bounds.height / 2);
  window.setTimeout(() => preview.remove(), 0);
}

export default function ScheduleBoard() {
  const [view, setView] = useState<ScheduleViewMode>("week");
  const [cursor, setCursor] = useState<Date | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 500);
  const { selected, toggle, cells: selectedCells, clear } = useAssignmentSelection();
  const createMutation = useCreateAssignment();
  const deleteMutation = useDeleteAssignment();
  const publishMutation = usePublishSchedule();
  const moveMutation = useMoveAssignment();
  const applyTemplateMutation = useApplyAssignmentTemplate();
  const updateAssignmentMutation = useUpdateAssignment();
  const [templateMenuOpen, setTemplateMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomInput>({
    resolver: zodResolver(customSchema), defaultValues: { startTime: "09:00", endTime: "17:00" },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setCursor(new Date()), 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  const notify = (text: string, tone: Toast["tone"] = "success") => setToast({ text, tone });
  const range = useMemo(() => {
    if (!cursor) return null;
    return getScheduleRange(cursor, view);
  }, [cursor, view]);
  const dates = useMemo(() => range ? getRangeDates(range) : [], [range]);
  const scheduleParams = useMemo(() => range ? new URLSearchParams({ from: toIsoDate(range.from), to: toIsoDate(range.to), search: debouncedSearch }) : null, [range, debouncedSearch]);
  const { data, isError, isLoading } = useSchedule(scheduleParams);

  const create = async (body: CreateAssignmentInput) => {
    try {
      await createMutation.mutateAsync(body);
      notify("Смена сохранена");
      clear();
    } catch {
      notify("Не удалось сохранить смену", "error");
    }
  };
  const assignTemplate = async (template: ShiftTemplate, employeeId?: string, date?: string) => {
    if (employeeId && date) return create({ cells: [{ employeeId, date }], templateId: template.id });
    const cells = selectedCells();
    if (!cells.length) return;
    const occupied = cells.map((cell) => assignments.get(scheduleCellKey(cell.employeeId, cell.date))).filter((assignment): assignment is ShiftAssignment => Boolean(assignment));
    const empty = cells.filter((cell) => !assignments.has(scheduleCellKey(cell.employeeId, cell.date)));
    try {
      await Promise.all(occupied.map((assignment) => applyTemplateMutation.mutateAsync({ id: assignment.id, templateId: template.id })));
      if (empty.length) await createMutation.mutateAsync({ cells: empty, templateId: template.id });
      clear();
      setTemplateMenuOpen(false);
      notify("Шаблон применён");
    } catch {
      notify("Не удалось применить шаблон", "error");
    }
  };
  const clickCell = (employeeId: string, date: string) => toggle(employeeId, date);
  const remove = async (assignment: ShiftAssignment) => {
    try {
      await deleteMutation.mutateAsync(assignment.id);
      notify("Смена удалена");
    } catch {
      notify("Не удалось удалить смену", "error");
    }
  };
  const submitCustom = handleSubmit(async (values) => {
    const cells = selectedCells();
    if (!cells.length) { notify("Сначала выделите ячейки", "error"); return; }
    const occupied = cells.map((cell) => assignments.get(scheduleCellKey(cell.employeeId, cell.date))).filter((assignment): assignment is ShiftAssignment => Boolean(assignment));
    const empty = cells.filter((cell) => !assignments.has(scheduleCellKey(cell.employeeId, cell.date)));
    try {
      await Promise.all(occupied.map((assignment) => updateAssignmentMutation.mutateAsync({ id: assignment.id, ...values })));
      if (empty.length) await createMutation.mutateAsync({ cells: empty, ...values });
      clear();
      notify("Своя смена применена");
    } catch {
      notify("Не удалось применить свою смену", "error");
    }
  });
  const assignments = new Map(data?.assignments.map((item) => [scheduleCellKey(item.employeeId, item.date), item]));
  const coverage = (date: string) => data?.assignments.filter((item) => item.date === date).length ?? 0;
  const selectedList = selectedCells();
  const selectionStats = {
    cells: selectedList.length,
    employees: new Set(selectedList.map((cell) => cell.employeeId)).size,
    days: new Set(selectedList.map((cell) => cell.date)).size,
  };
  const clearSelectedAssignments = async () => {
    const ids = selectedCells().map((cell) => assignments.get(scheduleCellKey(cell.employeeId, cell.date))?.id).filter((id): id is string => Boolean(id));
    try {
      await Promise.all(ids.map((id) => deleteMutation.mutateAsync(id)));
      clear();
      notify(ids.length ? "Выбранные смены удалены" : "В выбранных ячейках нет смен");
    } catch {
      notify("Не удалось удалить выбранные смены", "error");
    }
  };
  const moveAssignedShift = async (assignmentId: string, employeeId: string, date: string) => {
    try {
      await moveMutation.mutateAsync({ id: assignmentId, employeeId, date });
      notify("Смена перемещена");
    } catch {
      notify("Нельзя переместить смену в занятую ячейку", "error");
    }
  };
  const dayColumn = view === "week" ? "minmax(90px, 1fr)" : "52px";
  const calendarColumns = `220px repeat(${dates.length}, ${dayColumn})`;

  return <div className="p-7 max-md:p-4">
    <div className="flex h-11 items-center gap-3 text-sm text-[#4b4d55]"><button className="grid size-9 place-items-center rounded-full bg-white" onClick={() => history.back()}>‹</button>Графики смен</div>
    <header className="my-5 flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-3xl font-medium tracking-tight">График</h1><p className="mt-1 text-xs text-[#85878f]">{data?.publishedAt ? `Опубликован ${new Date(data.publishedAt).toLocaleString("ru-RU")}` : "Черновик"}</p></div>
      <div className="flex gap-1"><button disabled={publishMutation.isPending} className="h-10 rounded-md bg-[#e7ecfc] px-4 text-sm font-medium text-[#2453e9] disabled:opacity-60" onClick={() => publishMutation.mutate(undefined, { onSuccess: () => notify("График опубликован"), onError: () => notify("Не удалось опубликовать график", "error") })}>{publishMutation.isPending ? "Публикуем…" : "Опубликовать"}</button><button className="h-10 rounded-md bg-[#5d7bea] px-4 text-sm font-medium text-white" onClick={() => notify("Изменения сохраняются автоматически")}>Сохранить</button></div>
    </header>
    {toast && <div role="status" aria-live="polite" className={`fixed right-6 bottom-6 z-50 max-w-sm rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toast.tone === "error" ? "bg-[#ed4949]" : "bg-[#5d7bea]"}`}>{toast.text}</div>}
    <div className="grid grid-cols-[minmax(620px,1fr)_290px] gap-2 max-[1000px]:grid-cols-1">
      <section className="flex h-[calc(100dvh-190px)] min-h-0 min-w-0 flex-col overflow-hidden rounded-[20px] bg-white p-3 max-[1000px]:overflow-x-auto">
        {selected.size > 0 ? <div className="mb-5 flex h-12 shrink-0 items-center gap-4 rounded-xl bg-[#3c3c43] px-3 text-xs text-white">
          <span>Выделено: <strong className="ml-1 rounded bg-[#56565e] px-2 py-1 font-medium">{selectionStats.cells} ячеек</strong></span>
          <span>{selectionStats.employees} сотрудника(-ов) · {selectionStats.days} дн.</span>
          <span className="relative ml-auto flex items-center gap-4">
            <button className="flex items-center gap-1.5" type="button" onClick={() => setTemplateMenuOpen((value) => !value)}><Image src={gridIcon} width={16} height={16} alt="" />Применить шаблон</button>
            {templateMenuOpen && <span className="absolute right-32 top-9 z-30 min-w-44 rounded-lg bg-white p-1 text-[#101012] shadow-lg">{data?.templates.map((template) => <button className="block w-full rounded-md px-3 py-2 text-left hover:bg-[#f2f3f7]" type="button" key={template.id} onClick={() => void assignTemplate(template)}>{template.name}</button>)}</span>}
            <button className="flex items-center gap-1.5" type="button" onClick={() => void clearSelectedAssignments()}><Image src={removeIcon} width={16} height={16} alt="" />Очистить</button>
            <button className="flex items-center gap-1.5" type="button" onClick={clear}><Image src={xIcon} width={16} height={16} alt="" />Снять</button>
          </span>
        </div> : <div className="mb-5 flex shrink-0 flex-wrap items-end gap-2">
          <SearchInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Поиск по ФИО" />
          <CalendarViewSwitch value={view} onChange={setView} />
          <DatePicker value={cursor ? toIsoDate(cursor) : ""} onChange={(value) => value && setCursor(new Date(`${value}T12:00:00`))} />
        </div>}
        {isLoading && <ScheduleTableSkeleton columns={view === "week" ? 7 : Math.min(dates.length, 12)} />}
        {isError && <p className="p-4 text-sm text-red-600">Не удалось загрузить график</p>}
        {!isLoading && !isError && <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-h-full min-w-full flex-col">
          <div data-testid="calendar-header" className="sticky top-0 z-20 grid h-12 w-max min-w-full shrink-0 bg-white" style={{ gridTemplateColumns: calendarColumns }}><div className="border-b border-[#dedee3] bg-white p-3 text-base text-[#737378]">Сотрудник</div>{dates.map((date) => <div key={toIsoDate(date)} className={`border-b border-[#dedee3] bg-white text-center text-sm text-[#737378] ${view === "month" ? "flex flex-col items-center justify-center py-1 leading-4" : "p-3"}`}>{view === "month" ? <><span>{date.toLocaleDateString("ru-RU", { weekday: "short" })}</span><span>{date.getDate()}</span></> : date.toLocaleDateString("ru-RU", { weekday: "short", day: "numeric" })}</div>)}</div>
          <div className="flex-1">
            {data?.employees.map((employee, row) =>
              <div key={employee.id} className={`grid h-[72px] w-max min-w-full ${row % 2 ? "bg-[#f8f8fa]" : ""}`} style={{ gridTemplateColumns: calendarColumns }}>
                <div className="flex h-[72px] w-[220px] items-center gap-2 px-2 py-4"><span className="grid size-10 shrink-0 place-items-center rounded-md text-xs font-semibold text-white" style={{ background: employee.color }}>{employee.fullName.split(" ").map((part) => part[0]).join("")}</span><span className="min-w-0 leading-none"><strong className="block truncate text-xs font-medium leading-6 text-[#101012]">{employee.fullName}</strong><small className="block truncate text-[10px] leading-4 text-[#96989f]">{employee.role} · {employee.weeklyHours} ч</small></span></div>
                {dates.map((date) => {
                  const day = toIsoDate(date);
                  const key = scheduleCellKey(employee.id, day);
                  const assignment = assignments.get(key);
                  const isSelected = selected.has(key);
                  const palette = assignment ? (isSelected ? { background: "#5b7dec", text: "#ffffff", accent: "#ffffff", border: "#5b7dec" } : getShiftPalette(assignment.templateName)) : null;
                  const duration = assignment ? getShiftDuration(assignment.startTime, assignment.endTime) : 0;
                  return (
                    <button
                      aria-label={`${employee.fullName}, ${day}${assignment ? `, смена ${formatShiftRange(assignment.startTime, assignment.endTime)}` : ", свободно"}`}
                      key={key}
                      draggable={Boolean(assignment)}
                      className={`relative mx-1 flex h-14 min-w-0 self-center items-center justify-center overflow-hidden rounded-lg text-left text-[10px] ${assignment ? "border border-transparent" : isSelected ? "border border-[#5b7dec] bg-[#e8edfc]" : "border border-dashed border-[#dfe1e7]"}`}
                      onDragStart={(event) => { if (assignment) { event.dataTransfer.setData("assignmentId", assignment.id); setRoundedDragPreview(event, (event.currentTarget.firstElementChild as HTMLElement | null) ?? event.currentTarget); } }}
                      onClick={() => clickCell(employee.id, day)} onDrop={(event) => { event.preventDefault(); if (assignment) return; const assignmentId = event.dataTransfer.getData("assignmentId"); if (assignmentId) { void moveAssignedShift(assignmentId, employee.id, day); return; } const template = data.templates.find((item) => item.id === event.dataTransfer.getData("templateId")); if (template) void assignTemplate(template, employee.id, day); }} onDragOver={(event) => { if (!assignment) event.preventDefault(); }}>{assignment && palette ?
                        <span
                          className="flex h-full w-full flex-col items-center justify-center rounded-lg p-1 text-center"
                          style={{ background: palette.background, color: palette.text }}
                          onDoubleClick={() => void remove(assignment)}>
                          {view === "week" && <strong className="block text-xs font-normal">{formatShiftRange(assignment.startTime, assignment.endTime, true)}</strong>}
                          <span className="text-[10px] font-medium" style={{ color: palette.accent }}>{formatHours(duration)}</span>
                        </span> : isSelected ? <span className="grid h-full place-items-center">
                          <span className="grid size-5 place-items-center rounded-full bg-[#5b7dec]"><Image src={plusIcon} width={12} height={12} alt="" /></span>
                        </span> : null}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
          <div data-testid="calendar-coverage" className="sticky bottom-0 z-20 mt-auto grid h-12 w-max min-w-full shrink-0 bg-white" style={{ gridTemplateColumns: calendarColumns }}><span className="bg-white p-3 text-base text-[#737378]">Покрытие</span>{dates.map((date) => { const day = toIsoDate(date); const count = coverage(day); return <span key={day} className={`grid place-items-center text-sm ${count ? "bg-[#dff5fb] text-[#16758d]" : "bg-[#fde9e9] text-[#ed4949]"}`}>{count}</span>; })}</div>
        </div></div>}
      </section>
      <aside className="rounded-2xl bg-white p-4">
        <h2 className="text-sm font-medium">Шаблоны смен</h2><div className="mt-3 space-y-1">{data?.templates.map((template, index) => { const palette = getShiftPalette(template.name); const duration = getShiftDuration(template.startTime, template.endTime); return <button draggable onDragStart={(event) => { event.dataTransfer.setData("templateId", template.id); setRoundedDragPreview(event, event.currentTarget); }} key={template.id} className="w-full rounded-lg border-l-3 bg-[#f1f2f5] p-3 text-left" style={{ borderLeftColor: palette.border }} onClick={() => void assignTemplate(template)}><strong className="block text-sm">{template.name}<span className="float-right rounded bg-white px-1 text-xs">{index + 1}</span></strong><span className="text-xs">{formatShiftRange(template.startTime, template.endTime)} · {formatHours(duration)}</span></button>; })}</div>
        <form className="mt-6" onSubmit={submitCustom}><h2 className="text-sm font-medium">Своя смена</h2><div className="mt-3 grid grid-cols-2 gap-2"><label className="text-xs text-[#85878f]">Начало<input type="time" className="mt-1 h-11 w-full rounded-lg bg-[#f0f1f5] px-3 text-sm" {...register("startTime")} /></label><label className="text-xs text-[#85878f]">Конец<input type="time" className="mt-1 h-11 w-full rounded-lg bg-[#f0f1f5] px-3 text-sm" {...register("endTime")} /></label></div>{(errors.startTime || errors.endTime) && <p className="mt-1 text-xs text-red-600">Проверьте время</p>}<button disabled={isSubmitting} className="mt-2 h-11 w-full rounded-lg bg-[#e8ecfb] text-sm font-medium text-[#2453e9]">＋ Поставить в выделенные ({selected.size})</button></form>
      </aside>
    </div>
  </div>;
}
