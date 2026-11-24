import type { Process, GanttSegment, ProcessMetrics, SimulationResult } from "./types";

export function calculateMetrics(processes: Process[], segments: GanttSegment[]): SimulationResult {
  const map = new Map<string, ProcessMetrics>();
  processes.forEach(p => map.set(p.id, { pid: p.id, ct: 0, tat: 0, wt: 0, rt: -1 }));

  const firstStart = new Map<string, number>();
  for (const seg of segments) {
    if (seg.pid === "idle") continue;
    if (!firstStart.has(seg.pid)) firstStart.set(seg.pid, seg.start);
    const m = map.get(seg.pid)!;
    m.ct = Math.max(m.ct, seg.end);
  }

  let totalBurst = 0;
  for (const p of processes) {
    const m = map.get(p.id)!;
    m.tat = m.ct - p.arrival;
    m.wt = m.tat - p.burst;
    m.rt = (firstStart.get(p.id) ?? p.arrival) - p.arrival;
    totalBurst += p.burst;
  }

  const metrics = Array.from(map.values());
  const n = metrics.length || 1;
  const totalTime = segments.at(-1)?.end ?? 0;

  return {
    segments,
    metrics,
    averages: {
      wt: metrics.reduce((s, m) => s + m.wt, 0) / n,
      tat: metrics.reduce((s, m) => s + m.tat, 0) / n,
      rt: metrics.reduce((s, m) => s + m.rt, 0) / n,
      utilization: totalTime ? (totalBurst / totalTime) * 100 : 0,
      throughput: totalTime ? n / totalTime : 0,
    },
    totalTime,
  };
}
