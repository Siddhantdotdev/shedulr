"use client";
import { useSimulationStore } from "@/store/simulation-store";
import { useMemo } from "react";

export function GanttChart() {
  const { result, playbackIndex } = useSimulationStore();
  const visible = useMemo(() => result?.segments.slice(0, playbackIndex + 1) ?? [], [result, playbackIndex]);

  if (!result) return <div className="h-32 flex items-center justify-center border border-border text-xs text-muted-foreground">Run simulation</div>;

  const scale = 24;
  const height = 56;
  const width = Math.max(result.totalTime * scale, 640);

  return (
    <div className="overflow-x-auto border border-border rounded-md bg-background">
      <svg width={width} height={height + 24} className="block">
        {visible.map((seg, i) => {
          const x = seg.start * scale;
          const w = Math.max((seg.end - seg.start) * scale, 1);
          return (
            <g key={i}>
              <rect x={x} y={8} width={w} height={height - 16} fill={seg.color} />
              {w > 20 && <text x={x + w / 2} y={height / 2 + 4} textAnchor="middle" className="fill-white text-[11px] font-medium">{seg.pid}</text>}
              <text x={x} y={height + 16} className="fill-muted-foreground text-[10px]">{seg.start}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
