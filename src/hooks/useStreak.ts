/**
 * hooks/useStreak.ts
 *
 * Manages a live session streak counter for gesture recognition practice.
 * Counts consecutive correct detections of the TARGET sign,
 * emits milestone callbacks at 5, 10, 20 consecutive correct hits,
 * and exposes a reset function for when the sign changes.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface StreakState {
  current: number;       // consecutive correct detections this session
  best: number;          // personal best this session
  totalCorrect: number;  // total correct detections this session
  milestone: number | null; // last milestone reached (5, 10, 20…)
}

const MILESTONES = [5, 10, 20, 30, 50];

export function useStreak(detectedSign: string | null, targetSign: string | null) {
  const [streak, setStreak] = useState<StreakState>({
    current: 0,
    best: 0,
    totalCorrect: 0,
    milestone: null,
  });

  const prevDetectedRef = useRef<string | null>(null);
  const milestoneTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetStreak = useCallback(() => {
    setStreak((s) => ({ ...s, current: 0, milestone: null }));
  }, []);

  useEffect(() => {
    if (!targetSign || !detectedSign) {
      // If hand disappears, reset current streak
      if (prevDetectedRef.current !== null && detectedSign === null) {
        setStreak((s) => ({ ...s, current: 0 }));
      }
      prevDetectedRef.current = detectedSign;
      return;
    }

    const isCorrect = detectedSign.toUpperCase() === targetSign.toUpperCase();
    const wasCorrect =
      prevDetectedRef.current?.toUpperCase() === targetSign.toUpperCase();

    // Only count a NEW correct frame (transition from wrong → correct)
    if (isCorrect && !wasCorrect) {
      setStreak((prev) => {
        const newCurrent = prev.current + 1;
        const newBest = Math.max(prev.best, newCurrent);
        const newTotal = prev.totalCorrect + 1;

        // Find highest milestone crossed
        const crossed = MILESTONES.filter((m) => m <= newCurrent && (prev.milestone ?? 0) < m);
        const newMilestone = crossed.length > 0 ? Math.max(...crossed) : prev.milestone;

        // Auto-clear milestone toast after 3s
        if (newMilestone !== prev.milestone && milestoneTimerRef.current) {
          clearTimeout(milestoneTimerRef.current);
        }
        if (newMilestone !== prev.milestone) {
          milestoneTimerRef.current = setTimeout(() => {
            setStreak((s) => ({ ...s, milestone: null }));
          }, 3000);
        }

        return {
          current: newCurrent,
          best: newBest,
          totalCorrect: newTotal,
          milestone: newMilestone,
        };
      });
    } else if (!isCorrect && wasCorrect) {
      setStreak((s) => ({ ...s, current: 0 }));
    }

    prevDetectedRef.current = detectedSign;
  }, [detectedSign, targetSign]);

  // Cleanup timer on unmount
  useEffect(() => () => {
    if (milestoneTimerRef.current) clearTimeout(milestoneTimerRef.current);
  }, []);

  return { streak, resetStreak };
}
