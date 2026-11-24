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
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Github,
  Moon,
  Sun,
} from "lucide-react";

export default function Home() {
  const { algorithm, setAlgorithm, quantum, setQuantum, run, speed, setSpeed } = useSimulationStore();
  const playback = usePlayback();
  const [showComparison, setShowComparison] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(v => !v);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-12 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-sm bg-accent" />
            <span className="text-sm font-semibold tracking-tight">Shedulr</span>
            <span className="text-xs text-muted-foreground">CPU Scheduler</span>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={toggleTheme} className="h-7 w-7 p-0">
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
            <Button size="sm" variant="ghost" asChild className="h-7 w-7 p-0">
              <a href="https://github.com/Siddhantdotdev/shedulr" target="_blank" rel="noreferrer">
                <Github className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
        <aside className="border-r border-border bg-muted/20 p-4 space-y-5">
          <ProcessEditor />

          <div className="space-y-2.5">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Scheduling</div>
            <select
              value={algorithm}
              onChange={e => setAlgorithm(e.target.value as any)}
              className="w-full h-8 text-xs border border-border rounded bg-background px-2 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="fcfs">FCFS</option>
              <option value="sjf">SJF (Non-preemptive)</option>
              <option value="srtf">SRTF (Preemptive)</option>
              <option value="priority-np">Priority (Non-preemptive)</option>
              <option value="priority-p">Priority (Preemptive)</option>
              <option value="rr">Round Robin</option>
            </select>

            {algorithm === "rr" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Quantum</span>
                <Input
                  type="number"
                  min={1}
                  value={quantum}
                  onChange={e => setQuantum(+e.target.value)}
                  className="h-7 w-16 text-xs"
                />
              </div>
            )}

            <Button size="sm" onClick={run} className="w-full h-8 text-xs">
              Run Simulation
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowComparison(v => !v)}
            className="w-full h-7 text-xs"
          >
            {showComparison ? "Hide" : "Show"} Comparison
          </Button>
        </aside>

        <main className="flex flex-col min-h-[calc(100vh-3rem)]">
          <div className="flex-1 p-4 space-y-4">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timeline</div>
            <GanttChart />

            <div className="flex items-center gap-1 border border-border rounded-md p-1 w-fit bg-muted/30">
              <Button size="sm" variant="ghost" onClick={playback.play} className="h-7 w-7 p-0">
                <Play className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={playback.pause} className="h-7 w-7 p-0">
                <Pause className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={playback.stepBackward} className="h-7 w-7 p-0">
                <SkipBack className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={playback.stepForward} className="h-7 w-7 p-0">
                <SkipForward className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="ghost" onClick={playback.restart} className="h-7 w-7 p-0">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <div className="flex items-center gap-1 px-2 border-l border-border ml-1">
                <span className="text-[10px] text-muted-foreground">Speed</span>
                <select
                  value={speed}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className="h-6 text-[10px] bg-transparent border-none focus:outline-none"
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={4}>4x</option>
                </select>
              </div>
            </div>

            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">Metrics</div>
            <MetricsTable />

            {showComparison && (
              <>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">Comparison</div>
                <ComparisonView />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
