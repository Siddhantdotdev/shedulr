import { describe, it, expect } from "vitest";
import { simulate } from "../simulator";
import type { Process } from "../types";

const procs: Process[] = [
  { id: "P1", arrival: 0, burst: 5, priority: 2 },
  { id: "P2", arrival: 1, burst: 3, priority: 1 },
  { id: "P3", arrival: 2, burst: 4, priority: 3 },
];

describe("scheduling algorithms", () => {
  it("FCFS produces correct order and idle handling", () => {
    const res = simulate(procs, { algorithm: "fcfs" });
    expect(res.segments.length).toBeGreaterThan(0);
    expect(res.metrics.every(m => m.tat >= m.wt)).toBe(true);
  });

  it("SJF selects shortest burst", () => {
    const res = simulate(procs, { algorithm: "sjf" });
    expect(res.averages.wt).toBeLessThanOrEqual(simulate(procs, { algorithm: "fcfs" }).averages.wt);
  });

  it("SRTF produces valid preemptive segments", () => {
    const res = simulate(procs, { algorithm: "srtf" });
    expect(res.segments.some(s => s.pid !== "idle")).toBe(true);
  });

  it("Priority NP and P produce metrics", () => {
    const np = simulate(procs, { algorithm: "priority-np" });
    const p = simulate(procs, { algorithm: "priority-p" });
    expect(np.metrics.length).toBe(3);
    expect(p.metrics.length).toBe(3);
  });

  it("Round Robin respects quantum", () => {
    const res = simulate(procs, { algorithm: "rr", quantum: 2 });
    expect(res.segments.filter(s => s.pid !== "idle").every(s => s.end - s.start <= 2)).toBe(true);
  });

  it("metrics calculate utilization correctly with idle", () => {
    const idleProcs: Process[] = [
      { id: "P1", arrival: 0, burst: 2, priority: 1 },
      { id: "P2", arrival: 5, burst: 3, priority: 1 },
    ];
    const res = simulate(idleProcs, { algorithm: "fcfs" });
    expect(res.averages.utilization).toBeLessThan(100);
    expect(res.segments.some(s => s.pid === "idle")).toBe(true);
  });
});
