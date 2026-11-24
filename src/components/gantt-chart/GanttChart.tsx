"use client";
import { useSimulationStore } from "@/store/simulation-store";

export function GanttChart() {
  const { result, playbackIndex, currentTime } = useSimulationStore();

  if (!result) {
    return (
      <div className="h-40 flex items-center justify-center border border-border text-xs text-muted-foreground rounded-md">
        Run a simulation to see the timeline
      </div>
    );
  }

  const scale = 32;
  const height = 72;
  const width = Math.max(result.totalTime * scale + 48, 720);

  return (
    <div className="relative">
      <div className="absolute top-2 right-3 text-xs text-muted-foreground font-mono z-10">
        t = {currentTime ?? 0}
      </div>
      <div className="overflow-x-auto border border-border rounded-md bg-background">
        <svg width={width} height={height + 32} className="block">
          {result.segments.map((seg, i) => {
            const x = seg.start * scale;
            const w = Math.max((seg.end - seg.start) * scale, 3);
            const isActive = playbackIndex < 0 || i <= playbackIndex;
            const isCurrent = i === playbackIndex;
            const isIdle = seg.pid === "idle";

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={12}
                  width={w}
                  height={height - 20}
                  fill={isIdle ? "#3f3f46" : seg.color}
                  opacity={isActive ? 1 : 0.4}
                  stroke={isCurrent ? "#fafafa" : isIdle ? "#52525b" : "transparent"}
                  strokeWidth={isCurrent ? 2 : 0.5}
                  rx={2}
                />
                {!isIdle && w > 22 && (
                  <text
                    x={x + w / 2}
                    y={height / 2 + 2}
                    textAnchor="middle"
                    className="fill-white text-[12px] font-medium pointer-events-none"
                    opacity={isActive ? 1 : 0.6}
                  >
                    {seg.pid}
                  </text>
                )}
                <text
                  x={x + 2}
                  y={height + 20}
                  className="fill-muted-foreground text-[10px] font-mono"
                >
                  {seg.start}
                </text>
                {i === result.segments.length - 1 && (
                  <text
                    x={seg.end * scale - 8}
                    y={height + 20}
                    className="fill-muted-foreground text-[10px] font-mono"
                  >
                    {seg.end}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
