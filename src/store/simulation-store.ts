import { create } from "zustand";
import type { Process, Algorithm, SimulationResult } from "@/lib/scheduler/types";
import { simulate } from "@/lib/scheduler/simulator";

interface State {
  processes: Process[];
  algorithm: Algorithm;
  quantum: number;
  result: SimulationResult | null;
  playbackIndex: number;
  isPlaying: boolean;
  speed: number;
  currentTime: number;
  addProcess: () => void;
  updateProcess: (i: number, patch: Partial<Process>) => void;
  removeProcess: (i: number) => void;
  setAlgorithm: (a: Algorithm) => void;
  setQuantum: (q: number) => void;
  setSpeed: (s: number) => void;
  run: () => void;
  setPlaybackIndex: (i: number) => void;
  setIsPlaying: (v: boolean) => void;
  setCurrentTime: (t: number) => void;
}

export const useSimulationStore = create<State>((set, get) => ({
  processes: [
    { id: "P1", arrival: 0, burst: 5, priority: 1 },
    { id: "P2", arrival: 1, burst: 3, priority: 2 },
    { id: "P3", arrival: 2, burst: 4, priority: 1 },
  ],
  algorithm: "fcfs",
  quantum: 2,
  result: null,
  playbackIndex: -1,
  isPlaying: false,
  speed: 1,
  currentTime: 0,
  addProcess: () => set(s => ({ processes: [...s.processes, { id: `P${s.processes.length + 1}`, arrival: 0, burst: 1, priority: 1 }] })),
  updateProcess: (i, patch) => set(s => {
    const next = [...s.processes];
    next[i] = { ...next[i], ...patch };
    return { processes: next };
  }),
  removeProcess: (i) => set(s => ({ processes: s.processes.filter((_, idx) => idx !== i) })),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setQuantum: (quantum) => set({ quantum }),
  setSpeed: (speed) => set({ speed }),
  run: () => {
    try {
      const result = simulate(get().processes, { algorithm: get().algorithm, quantum: get().quantum });
      set({ result, playbackIndex: -1, isPlaying: false, currentTime: 0 });
    } catch (e) {
      console.error(e);
    }
  },
  setPlaybackIndex: (playbackIndex) => {
    const result = get().result;
    const currentTime = result && playbackIndex >= 0 && result.segments[playbackIndex]
      ? result.segments[playbackIndex].start
      : 0;
    set({ playbackIndex, currentTime });
  },
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
}));
