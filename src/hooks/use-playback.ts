"use client";

import { useEffect } from "react";
import { useSimulationStore } from "@/store/simulation-store";

export function usePlayback() {
  const { result, playbackIndex, isPlaying, setPlaybackIndex, setIsPlaying } = useSimulationStore();

  useEffect(() => {
    if (!isPlaying || !result) return;
    const id = setInterval(() => {
      setPlaybackIndex(prev => {
        const next = prev < 0 ? 0 : prev + 1;
        if (next >= result.segments.length) {
          setIsPlaying(false);
          return result.segments.length - 1;
        }
        return next;
      });
    }, 700);
    return () => clearInterval(id);
  }, [isPlaying, result, setPlaybackIndex, setIsPlaying]);

  return {
    play: () => {
      if (!result) return;
      if (playbackIndex < 0 || playbackIndex >= result.segments.length - 1) {
        setPlaybackIndex(0);
      }
      setIsPlaying(true);
    },
    pause: () => setIsPlaying(false),
    stepForward: () => {
      if (!result) return;
      const next = playbackIndex < 0 ? 0 : Math.min(playbackIndex + 1, result.segments.length - 1);
      setPlaybackIndex(next);
    },
    stepBackward: () => {
      const next = playbackIndex <= 0 ? -1 : playbackIndex - 1;
      setPlaybackIndex(next);
    },
    restart: () => {
      setPlaybackIndex(-1);
      setIsPlaying(false);
    },
  };
}
