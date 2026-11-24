"use client";

import { useState } from "react";
import { ProcessEditor } from "@/components/process-editor/ProcessEditor";
import { GanttChart } from "@/components/gantt-chart/GanttChart";
import { MetricsTable } from "@/components/metrics-table/MetricsTable";
import { ComparisonView } from "@/components/metrics-table/ComparisonView";
import { useSimulationStore } from "@/store/simulation-store";
import { usePlayback } from "@/hooks/use-playback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { algorithm, setAlgorithm, quantum, setQuantum, run } = useSimulationStore();
  const playback = usePlayback();
  const [showComparison, setShowComparison] = useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-lg font-medium">Shedulr</h1>
        <p className="text-xs text-muted-foreground">Interactive CPU scheduling simulator</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 p-6">
        <aside className="space-y-6">
          <ProcessEditor />

          <div className="space-y-2">
            <label className="text-xs font-medium">Algorithm</label>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value as any)}
              className="w-full h-8 text-xs border border-border rounded px-2 bg-background"
            >
              <option value="fcfs">FCFS</option>
              <option value="sjf">SJF</option>
              <option value="srtf">SRTF</option>
              <option value="priority-np">Priority NP</option>
              <option value="priority-p">Priority P</option>
              <option value="rr">Round Robin</option>
            </select>

            {algorithm === "rr" && (
              <div className="flex items-center gap-2">
                <label className="text-xs">Quantum</label>
                <Input
                  type="number"
                  min={1}
                  value={quantum}
                  onChange={e => setQuantum(+e.target.value)}
                  className="h-7 w-20 text-xs"
                />
              </div>
            )}

            <Button size="sm" onClick={run} className="w-full">
              Run Simulation
            </Button>
          </div>

          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={playback.play}>Play</Button>
            <Button size="sm" variant="outline" onClick={playback.pause}>Pause</Button>
            <Button size="sm" variant="outline" onClick={playback.stepBackward}>←</Button>
            <Button size="sm" variant="outline" onClick={playback.stepForward}>→</Button>
            <Button size="sm" variant="outline" onClick={playback.restart}>Reset</Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowComparison(v => !v)}
            className="w-full"
          >
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
        </aside>

        <section className="space-y-6">
          <GanttChart />
          <MetricsTable />
          {showComparison && <ComparisonView />}
        </section>
      </div>
    </main>
  );
}
