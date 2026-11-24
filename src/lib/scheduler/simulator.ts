import type { Process, SchedulerConfig, SimulationResult } from "./types";
import { runFCFS } from "./fcfs";
import { runSJF } from "./sjf";
import { runSRTF } from "./srtf";
import { runPriority } from "./priority";
import { runRR } from "./round-robin";
import { calculateMetrics } from "./metrics";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"];

export function simulate(processes: Process[], config: SchedulerConfig): SimulationResult {
  if (!processes.length) throw new Error("No processes");
  if (processes.some(p => p.burst <= 0 || p.arrival < 0)) throw new Error("Invalid input");

  let raw: { pid: string | "idle"; start: number; end: number }[] = [];

  switch (config.algorithm) {
    case "fcfs":
      raw = runFCFS(processes);
      break;
    case "sjf":
      raw = runSJF(processes);
      break;
    case "srtf":
      raw = runSRTF(processes);
      break;
    case "priority-np":
      raw = runPriority(processes, false, config.higherNumberHigherPriority);
      break;
    case "priority-p":
      raw = runPriority(processes, true, config.higherNumberHigherPriority);
      break;
    case "rr":
      if (!config.quantum || config.quantum <= 0) throw new Error("Quantum required");
      raw = runRR(processes, config.quantum);
      break;
    default:
      throw new Error("Unknown algorithm");
  }

  const colorMap = new Map(processes.map((p, i) => [p.id, COLORS[i % COLORS.length]]));
  const segments = raw.map(s => ({
    ...s,
    color: s.pid === "idle" ? "#e5e7eb" : colorMap.get(s.pid) ?? "#9ca3af",
  }));

  return calculateMetrics(processes, segments);
}
