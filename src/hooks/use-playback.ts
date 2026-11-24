"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/store/simulation-store";

export function usePlayback() {
  const { result, playbackIndex, isPlaying, setPlaybackIndex, setIsPlaying } = useSimulationStore();

  useEffect(() => {
    if (!isPlaying || !result) return;
    const id = setInterval(() => {
      setPlaybackIndex(prev => {
        if (prev >= result.segments.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(id);
  }, [isPlaying, result, setPlaybackIndex, setIsPlaying]);

  return {
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    stepForward: () => result && setPlaybackIndex(Math.min(playbackIndex + 1, result.segments.length - 1)),
    stepBackward: () => setPlaybackIndex(Math.max(playbackIndex - 1, 0)),
    restart: () => {
      setPlaybackIndex(0);
      setIsPlaying(false);
    },
  };
}
