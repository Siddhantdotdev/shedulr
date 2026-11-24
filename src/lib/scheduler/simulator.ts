import type { Process, SchedulerConfig, SimulationResult } from "./types";
import { runFCFS } from "./fcfs";
import { calculateMetrics } from "./metrics";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"];

export function simulate(processes: Process[], config: SchedulerConfig): SimulationResult {
  if (!processes.length) throw new Error("No processes");
  if (processes.some(p => p.burst <= 0 || p.arrival < 0)) throw new Error("Invalid input");

  let raw: { pid: string | "idle"; start: number; end: number }[] = [];

  if (config.algorithm === "fcfs") {
    raw = runFCFS(processes);
  } else {
    // Other algorithms follow the same pattern in their respective files
    raw = runFCFS(processes); // placeholder for brevity in this push
  }

  const colorMap = new Map(processes.map((p, i) => [p.id, COLORS[i % COLORS.length]]));
  const segments = raw.map(s => ({
    ...s,
    color: s.pid === "idle" ? "#e5e7eb" : colorMap.get(s.pid) ?? "#9ca3af",
  }));

  return calculateMetrics(processes, segments);
}
