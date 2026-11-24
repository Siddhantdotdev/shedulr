"use client";

import { useState } from "react";
import { useSimulationStore } from "@/store/simulation-store";
import { simulate } from "@/lib/scheduler/simulator";
import type { Algorithm } from "@/lib/scheduler/types";

const ALGOS: { id: Algorithm; label: string }[] = [
  { id: "fcfs", label: "FCFS" },
  { id: "sjf", label: "SJF" },
  { id: "srtf", label: "SRTF" },
  { id: "priority-np", label: "Priority NP" },
  { id: "priority-p", label: "Priority P" },
  { id: "rr", label: "RR" },
];

export function ComparisonView() {
  const { processes, quantum } = useSimulationStore();
  const [selected, setSelected] = useState<Algorithm | null>(null);

  const results = ALGOS.map(a => {
    try {
      const res = simulate(processes, {
        algorithm: a.id,
        quantum: a.id === "rr" ? quantum : undefined,
      });
      return { ...a, averages: res.averages };
    } catch {
      return null;
    }
  }).filter(Boolean) as { id: Algorithm; label: string; averages: NonNullable<ReturnType<typeof simulate>["averages"]> }[];

  const bestWT = Math.min(...results.map(r => r.averages.wt));
  const bestTAT = Math.min(...results.map(r => r.averages.tat));

  return (
    <div className="space-y-3">
      <div className="border border-border rounded-md overflow-hidden text-xs">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2 text-left">Algorithm</th>
              <th className="p-2 text-left">Avg WT</th>
              <th className="p-2 text-left">Avg TAT</th>
              <th className="p-2 text-left">Avg RT</th>
              <th className="p-2 text-left">CPU %</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr
                key={r.id}
                className={`border-t border-border cursor-pointer hover:bg-muted/30 ${
                  selected === r.id ? "bg-muted/50" : ""
                }`}
                onClick={() => setSelected(r.id)}
              >
                <td className="p-2 font-medium">{r.label}</td>
                <td className={`p-2 ${r.averages.wt === bestWT ? "font-semibold text-blue-600" : ""}`}>
                  {r.averages.wt.toFixed(2)}
                </td>
                <td className={`p-2 ${r.averages.tat === bestTAT ? "font-semibold text-blue-600" : ""}`}>
                  {r.averages.tat.toFixed(2)}
                </td>
                <td className="p-2">{r.averages.rt.toFixed(2)}</td>
                <td className="p-2">{r.averages.utilization.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
