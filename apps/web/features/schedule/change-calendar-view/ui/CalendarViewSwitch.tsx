"use client";

import type { ScheduleViewMode } from "@/entities/schedule";
import { motion } from "framer-motion";

type CalendarViewSwitchProps = {
  value: ScheduleViewMode;
  onChange: (value: ScheduleViewMode) => void;
};

export function CalendarViewSwitch({ value, onChange }: CalendarViewSwitchProps) {
  return (
    <div className="relative flex h-12 w-[301px] rounded-xl bg-[#f2f3f7] p-0.5" role="tablist" aria-label="Вид календаря">
      {(["month", "week"] as const).map((mode) => (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={value === mode}
          className={`relative z-0 flex-1 rounded-[10px] text-base font-semibold transition-colors duration-200 ${value === mode ? "text-white" : "text-[#101012]"}`}
          onClick={() => onChange(mode)}
        >
          {value === mode && <motion.span layoutId="calendar-view-active" className="absolute inset-0 -z-10 rounded-[10px] bg-[#3c3c43]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
          {mode === "month" ? "Месяц" : "Неделя"}
        </button>
      ))}
    </div>
  );
}
