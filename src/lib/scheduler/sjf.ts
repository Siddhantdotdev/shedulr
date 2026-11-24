import type { Process, GanttSegment } from "./types";

export function runSJF(processes: Process[]): GanttSegment[] {
  const rem = processes.map(p => ({ ...p }));
  const segments: GanttSegment[] = [];
  let time = 0;
  const done = new Set<string>();

  while (done.size < processes.length) {
    const available = rem.filter(p => p.arrival <= time && !done.has(p.id));
    if (!available.length) {
      const next = rem.filter(p => !done.has(p.id)).sort((a, b) => a.arrival - b.arrival)[0];
      if (next && next.arrival > time) {
        segments.push({ pid: "idle", start: time, end: next.arrival });
        time = next.arrival;
      }
      continue;
    }
    available.sort((a, b) => a.burst - b.burst || a.id.localeCompare(b.id));
    const chosen = available[0];
    segments.push({ pid: chosen.id, start: time, end: time + chosen.burst });
    time += chosen.burst;
    done.add(chosen.id);
  }
  return segments;
}
