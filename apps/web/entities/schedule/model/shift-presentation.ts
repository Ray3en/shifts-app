export function getShiftDuration(startTime: string, endTime: string) {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  return ((end - start + 24 * 60) % (24 * 60)) / 60;
}

export function formatShiftRange(startTime: string, endTime: string, compact = false) {
  const start = compact && startTime.endsWith(":00") ? startTime.slice(0, 2) : startTime;
  const end = compact && endTime.endsWith(":00") ? endTime.slice(0, 2) : endTime;
  return `${start} - ${end}`;
}

export function formatHours(hours: number) {
  return `${Number.isInteger(hours) ? hours : hours.toFixed(1).replace(".", ",")} ч`;
}

export function getShiftPalette(templateName: string | null) {
  if (templateName === "Утро") return { background: "#e8edfc", text: "#101012", accent: "#5b7dec", border: "#afc1ff" };
  if (templateName === "День") return { background: "#eee5ff", text: "#101012", accent: "#814df5", border: "#c7a1ff" };
  if (templateName === "Вечер") return { background: "#dcf6f6", text: "#101012", accent: "#00a6a6", border: "#8fe4e0" };
  return { background: "#e8edfc", text: "#101012", accent: "#5b7dec", border: "#afc1ff" };
}
