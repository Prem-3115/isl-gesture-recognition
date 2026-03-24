import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type ISLSign, ALL_SIGNS, getSignById } from '../data/islSigns';

interface GestureContextType {
  currentSign: ISLSign | null;
  setCurrentSign: (sign: ISLSign | null) => void;
  setCurrentSignById: (id: string) => void;
  sessionStats: SessionStats;
  recordAttempt: (signId: string, accuracy: number) => void;
  resetSession: () => void;
}

export interface SessionStats {
  totalAttempts: number;
  successfulAttempts: number;
  averageAccuracy: number;
  bestAccuracy: number;
  signsAttempted: Record<string, { attempts: number; bestAccuracy: number; lastAccuracy: number }>;
}

const defaultStats: SessionStats = {
  totalAttempts: 0,
  successfulAttempts: 0,
  averageAccuracy: 0,
  bestAccuracy: 0,
  signsAttempted: {},
};

const GestureContext = createContext<GestureContextType | null>(null);

export function GestureProvider({ children }: { children: ReactNode }) {
  const [currentSign, setCurrentSignState] = useState<ISLSign | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>(defaultStats);

  const setCurrentSign = useCallback((sign: ISLSign | null) => {
    setCurrentSignState(sign);
  }, []);

  const setCurrentSignById = useCallback((id: string) => {
    const sign = getSignById(id);
    setCurrentSignState(sign ?? null);
  }, []);

  const recordAttempt = useCallback((signId: string, accuracy: number) => {
    setSessionStats(prev => {
      const existing = prev.signsAttempted[signId] ?? {
        attempts: 0,
        bestAccuracy: 0,
        lastAccuracy: 0,
      };

      const updated = {
        ...existing,
        attempts: existing.attempts + 1,
        bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
        lastAccuracy: accuracy,
      };

      const allAccuracies = Object.values({
        ...prev.signsAttempted,
        [signId]: updated,
      }).map(s => s.lastAccuracy);

      const avgAccuracy =
        allAccuracies.reduce((a, b) => a + b, 0) / allAccuracies.length;

      return {
        totalAttempts: prev.totalAttempts + 1,
        successfulAttempts:
          prev.successfulAttempts + (accuracy >= 75 ? 1 : 0),
        averageAccuracy: Math.round(avgAccuracy),
        bestAccuracy: Math.max(prev.bestAccuracy, accuracy),
        signsAttempted: {
          ...prev.signsAttempted,
          [signId]: updated,
        },
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    setSessionStats(defaultStats);
  }, []);

  return (
    <GestureContext.Provider
      value={{
        currentSign,
        setCurrentSign,
        setCurrentSignById,
        sessionStats,
        recordAttempt,
        resetSession,
      }}
    >
      {children}
    </GestureContext.Provider>
  );
}

export function useGestureContext() {
  const ctx = useContext(GestureContext);
  if (!ctx) throw new Error('useGestureContext must be used inside GestureProvider');
  return ctx;
}

// Convenience: get all signs grouped
export { ALL_SIGNS };