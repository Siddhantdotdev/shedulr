export type Algorithm =
  | "fcfs"
  | "sjf"
  | "srtf"
  | "priority-np"
  | "priority-p"
  | "rr";

export interface Process {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
}

export interface GanttSegment {
  pid: string | "idle";
  start: number;
  end: number;
  color?: string;
}

export interface ProcessMetrics {
  pid: string;
  ct: number;
  tat: number;
  wt: number;
  rt: number;
}

export interface SimulationResult {
  segments: GanttSegment[];
  metrics: ProcessMetrics[];
  averages: {
    wt: number;
    tat: number;
    rt: number;
    utilization: number;
    throughput: number;
  };
  totalTime: number;
}

export interface SchedulerConfig {
  algorithm: Algorithm;
  quantum?: number;
  higherNumberHigherPriority?: boolean;
}
