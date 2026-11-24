"use client";
import { useSimulationStore } from "@/store/simulation-store";
import { useMemo } from "react";

export function GanttChart() {
  const { result, playbackIndex } = useSimulationStore();

  if (!result) {
    return (
      <div className="h-32 flex items-center justify-center border border-border text-xs text-muted-foreground rounded-md">
        Run simulation
      </div>
    );
  }

  const scale = 28;
  const height = 64;
  const width = Math.max(result.totalTime * scale + 40, 640);

  return (
    <div className="overflow-x-auto border border-border rounded-md bg-background">
      <svg width={width} height={height + 28} className="block">
        {/* Time axis background */}
        <rect x={0} y={height} width={width} height={28} fill="transparent" />

        {result.segments.map((seg, i) => {
          const x = seg.start * scale;
          const w = Math.max((seg.end - seg.start) * scale, 2);
          const isActive = i <= playbackIndex;
          const isCurrent = i === playbackIndex;

          return (
            <g key={i}>
              <rect
                x={x}
                y={8}
                width={w}
                height={height - 16}
                fill={seg.color}
                opacity={playbackIndex < 0 || isActive ? 1 : 0.35}
                stroke={isCurrent ? "#fff" : "transparent"}
                strokeWidth={isCurrent ? 1.5 : 0}
              />
              {w > 18 && (
                <text
                  x={x + w / 2}
                  y={height / 2 + 4}
                  textAnchor="middle"
                  className="fill-white text-[11px] font-medium pointer-events-none"
                  opacity={playbackIndex < 0 || isActive ? 1 : 0.5}
                >
                  {seg.pid}
                </text>
              )}
              <text
                x={x}
                y={height + 18}
                className="fill-muted-foreground text-[10px]"
              >
                {seg.start}
              </text>
              {i === result.segments.length - 1 && (
                <text
                  x={seg.end * scale}
                  y={height + 18}
                  className="fill-muted-foreground text-[10px]"
                >
                  {seg.end}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
