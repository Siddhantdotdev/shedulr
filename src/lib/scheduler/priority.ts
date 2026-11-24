import type { Process, GanttSegment } from "./types";

export function runPriority(
  processes: Process[],
  preemptive: boolean,
  higherNumberHigherPriority = false
): GanttSegment[] {
  const rem = processes.map(p => ({ ...p, rem: p.burst }));
  const segments: GanttSegment[] = [];
  let time = 0;
  let current: (typeof rem)[0] | null = null;
  let segStart = 0;

  const better = (a: (typeof rem)[0], b: (typeof rem)[0]) => {
    const pa = higherNumberHigherPriority ? -a.priority : a.priority;
    const pb = higherNumberHigherPriority ? -b.priority : b.priority;
    return pa - pb || a.id.localeCompare(b.id);
  };

  while (rem.some(p => p.rem > 0)) {
    const available = rem.filter(p => p.arrival <= time && p.rem > 0);
    if (!available.length) {
      if (current) {
        segments.push({ pid: current.id, start: segStart, end: time });
        current = null;
      }
      const next = Math.min(...rem.filter(p => p.rem > 0).map(p => p.arrival));
      segments.push({ pid: "idle", start: time, end: next });
      time = next;
      continue;
    }

    available.sort(better);
    const next = available[0];

    if (!preemptive) {
      if (!current) {
        current = next;
        segStart = time;
      }
      const run = current.rem;
      segments.push({ pid: current.id, start: time, end: time + run });
      time += run;
      current.rem = 0;
      current = null;
      continue;
    }

    if (current && current.id !== next.id && better(next, current) < 0) {
      segments.push({ pid: current.id, start: segStart, end: time });
      current = next;
      segStart = time;
    } else if (!current) {
      current = next;
      segStart = time;
    }

    const nextEvent = Math.min(
      time + (current?.rem ?? 1),
      ...rem.filter(p => p.arrival > time).map(p => p.arrival),
      Infinity
    );
    const step = Math.min(1, nextEvent - time, current!.rem);
    current!.rem -= step;
    time += step;

    if (current!.rem === 0) {
      segments.push({ pid: current!.id, start: segStart, end: time });
      current = null;
    }
  }
  return segments;
}
