import type { Process, GanttSegment } from "./types";

export function runFCFS(processes: Process[]): GanttSegment[] {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id));
  const segments: GanttSegment[] = [];
  let time = 0;

  for (const p of sorted) {
    if (time < p.arrival) {
      segments.push({ pid: "idle", start: time, end: p.arrival });
      time = p.arrival;
    }
    segments.push({ pid: p.id, start: time, end: time + p.burst });
    time += p.burst;
  }
  return segments;
}
