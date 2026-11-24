import type { Process, GanttSegment } from "./types";

export function runRR(processes: Process[], quantum: number): GanttSegment[] {
  const rem = new Map(processes.map(p => [p.id, p.burst]));
  const queue: string[] = [];
  const arrived = new Set<string>();
  const segments: GanttSegment[] = [];
  let time = 0;

  const enqueue = (t: number) => {
    processes
      .filter(p => p.arrival <= t && !arrived.has(p.id))
      .sort((a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id))
      .forEach(p => {
        queue.push(p.id);
        arrived.add(p.id);
      });
  };

  enqueue(0);
  while (queue.length || arrived.size < processes.length) {
    if (!queue.length) {
      const next = processes.filter(p => !arrived.has(p.id)).sort((a, b) => a.arrival - b.arrival)[0];
      if (!next) break;
      segments.push({ pid: "idle", start: time, end: next.arrival });
      time = next.arrival;
      enqueue(time);
      continue;
    }
    const pid = queue.shift()!;
    const run = Math.min(quantum, rem.get(pid)!);
    segments.push({ pid, start: time, end: time + run });
    time += run;
    rem.set(pid, rem.get(pid)! - run);
    enqueue(time);
    if (rem.get(pid)! > 0) queue.push(pid);
    else rem.delete(pid);
  }
  return segments;
}
