import type { Process, GanttSegment } from "./types";

export function runSRTF(processes: Process[]): GanttSegment[] {
  const rem = processes.map(p => ({ ...p, rem: p.burst }));
  const segments: GanttSegment[] = [];
  let time = 0;
  let current: (typeof rem)[0] | null = null;
  let segStart = 0;

  while (rem.some(p => p.rem > 0)) {
    const available = rem.filter(p => p.arrival <= time && p.rem > 0);
    if (!available.length) {
      if (current) {
        segments.push({ pid: current.id, start: segStart, end: time });
        current = null;
      }
      const nextArrival = Math.min(...rem.filter(p => p.rem > 0).map(p => p.arrival));
      segments.push({ pid: "idle", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    available.sort((a, b) => a.rem - b.rem || a.id.localeCompare(b.id));
    const next = available[0];

    if (current?.id !== next.id) {
      if (current) segments.push({ pid: current.id, start: segStart, end: time });
      current = next;
      segStart = time;
    }

    const nextArrival = Math.min(...rem.filter(p => p.arrival > time && p.rem > 0).map(p => p.arrival), Infinity);
    const runUntil = Math.min(time + current.rem, nextArrival);
    const step = runUntil - time;
    current.rem -= step;
    time = runUntil;

    if (current.rem === 0) {
      segments.push({ pid: current.id, start: segStart, end: time });
      current = null;
    }
  }
  return segments;
}
