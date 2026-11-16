"use client";

import { motion } from "framer-motion";

const shimmer = { opacity: [0.45, 0.9, 0.45] };

export function ScheduleTableSkeleton({ columns }: { columns: number }) {
  return (
    <div className="flex min-h-[600px] flex-1 flex-col" aria-label="Загрузка графика" role="status">
      <div className="grid h-12 gap-px" style={{ gridTemplateColumns: `220px repeat(${columns}, minmax(90px, 1fr))` }}>
        {Array.from({ length: columns + 1 }, (_, index) => <motion.span key={index} className="m-2 rounded-md bg-[#e8e9ed]" animate={shimmer} transition={{ duration: 1.3, repeat: Infinity, delay: index * 0.04 }} />)}
      </div>
      {Array.from({ length: 7 }, (_, row) => (
        <div key={row} className="grid h-[72px] gap-px" style={{ gridTemplateColumns: `220px repeat(${columns}, minmax(90px, 1fr))` }}>
          {Array.from({ length: columns + 1 }, (_, column) => <motion.span key={column} className="m-2 rounded-lg bg-[#f0f1f5]" animate={shimmer} transition={{ duration: 1.3, repeat: Infinity, delay: (row + column) * 0.035 }} />)}
        </div>
      ))}
      <span className="sr-only">Загрузка графика…</span>
    </div>
  );
}
