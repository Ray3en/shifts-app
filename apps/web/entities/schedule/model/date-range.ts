export type ScheduleViewMode = "week" | "month";
export const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);
export const addDays = (date: Date, count: number) => { const value = new Date(date); value.setDate(value.getDate() + count); return value; };
export const getScheduleRange = (cursor: Date, view: ScheduleViewMode) => {
  if (view === "week") {
    const from = new Date(cursor);
    from.setDate(from.getDate() - (from.getDay() || 7) + 1);
    from.setHours(12, 0, 0, 0);
    return { from, to: addDays(from, 6) };
  }
  return { from: new Date(cursor.getFullYear(), cursor.getMonth(), 1, 12), to: new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 12) };
};
export const getRangeDates = ({ from, to }: { from: Date; to: Date }) =>
  Array.from({ length: Math.round((to.getTime() - from.getTime()) / 86400000) + 1 }, (_, index) => addDays(from, index));
export const scheduleCellKey = (employeeId: string, date: string) => `${employeeId}:${date}`;
