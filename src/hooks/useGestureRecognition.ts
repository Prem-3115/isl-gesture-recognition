import { useEffect, useRef, useState, useCallback } from 'react';
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision';
import {
  type Landmark,
  evaluateFingerStates,
} from '../data/islSigns';

export type RecognitionStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'detecting'
  | 'analyzing'
  | 'feedback'
  | 'error';

export interface GestureResult {
  feedback: string;
  handDetected: boolean;
  status: RecognitionStatus;
  landmarks: Landmark[] | null;
  detectedSign: string | null;
  confidence: number;
}

interface UseGestureRecognitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

const MEDIAPIPE_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm';

export function useGestureRecognition({
  videoRef,
  enabled,
}: UseGestureRecognitionOptions) {
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const stablePredictionRef = useRef<string | null>(null);
  const stableCountRef = useRef<number>(0);
  const lastFeedbackRef = useRef<string>('Initializing...');
  const predictionHistory = useRef<string[]>([]);

  const [result, setResult] = useState<GestureResult>({
    feedback: 'Initializing...',
    handDetected: false,
    status: 'idle',
    landmarks: null,
    detectedSign: null,
    confidence: 0,
  });

  const predictFromAPI = async (landmarks: number[]) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks }),
      });
      const data = await res.json();
      if (!res.ok || data.error) return null;
      return data;
    } catch {
      return null;
    }
  };

  const loadMediaPipe = useCallback(async () => {
    if (handLandmarkerRef.current) return;

    setResult(prev => ({ ...prev, status: 'loading', feedback: 'Loading AI model...' }));

    try {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
      });
      setResult(prev => ({
        ...prev,
        status: 'ready',
        feedback: 'Model ready! Show your hand.',
      }));
    } catch {
      setResult(prev => ({
        ...prev,
        status: 'error',
        feedback: 'Failed to load AI model.',
      }));
    }
  }, []);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const landmarker = handLandmarkerRef.current;

    if (!video || !landmarker || video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const currentTime = video.currentTime;
    if (currentTime === lastVideoTimeRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    lastVideoTimeRef.current = currentTime;

    let mpResult: HandLandmarkerResult;
    try {
      mpResult = landmarker.detectForVideo(video, performance.now());
    } catch {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const handDetected = mpResult.landmarks && mpResult.landmarks.length > 0;

    if (!handDetected) {
      predictionHistory.current = [];
      stablePredictionRef.current = null;
      stableCountRef.current = 0;
      const newFeedback = 'No hand detected — show your hand to the camera';
      if (lastFeedbackRef.current !== newFeedback) {
        lastFeedbackRef.current = newFeedback;
        setResult(prev => ({
          ...prev,
          handDetected: false,
          status: 'detecting',
          feedback: newFeedback,
          landmarks: null,
          detectedSign: null,
          confidence: 0,
        }));
      }
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const landmarks = mpResult.landmarks![0] as Landmark[];

    // Normalize landmarks relative to wrist
    const base = landmarks[0];
    const flattened = landmarks.flatMap(p => [
      p.x - base.x,
      p.y - base.y,
      p.z - base.z,
    ]);

    (async () => {
      const apiResult = await predictFromAPI(flattened);

      if (apiResult) {
        // Low confidence — model not sure
        if (apiResult.prediction === null || apiResult.prediction === undefined) {
          const conf = Math.round((apiResult.confidence ?? 0) * 100);
          const newFeedback = `Hand detected — not confident enough (${conf}%)`;
          if (lastFeedbackRef.current !== newFeedback) {
            lastFeedbackRef.current = newFeedback;
            setResult({
              feedback: newFeedback,
              handDetected: true,
              status: 'detecting',
              landmarks,
              detectedSign: null,
              confidence: apiResult.confidence ?? 0,
            });
          }
          animFrameRef.current = requestAnimationFrame(processFrame);
          return;
        }

        const predicted = apiResult.prediction.trim().toUpperCase();
        const confidence = apiResult.confidence ?? 0;

        // Smooth predictions over last 5 frames
        predictionHistory.current.push(predicted);
        if (predictionHistory.current.length > 5) {
          predictionHistory.current.shift();
        }

        const counts: Record<string, number> = {};
        predictionHistory.current.forEach(p => {
          counts[p] = (counts[p] || 0) + 1;
        });

        const bestPrediction = Object.keys(counts).reduce((a, b) =>
          counts[a] > counts[b] ? a : b
        );

        if (stablePredictionRef.current === bestPrediction) {
          stableCountRef.current += 1;
        } else {
          stablePredictionRef.current = bestPrediction;
          stableCountRef.current = 1;
        }

        // Only update when stable for 5 frames
        if (stableCountRef.current >= 5) {
          const conf = Math.round(confidence * 100);
          const newFeedback = `Detected: ${bestPrediction} (${conf}% confidence)`;
          if (lastFeedbackRef.current !== newFeedback) {
            lastFeedbackRef.current = newFeedback;
            setResult({
              feedback: newFeedback,
              handDetected: true,
              status: 'feedback',
              landmarks,
              detectedSign: bestPrediction,
              confidence,
            });
          }
        }

        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      // API call failed
      const newFeedback = 'Flask API not responding — is it running?';
      if (lastFeedbackRef.current !== newFeedback) {
        lastFeedbackRef.current = newFeedback;
        setResult({
          feedback: newFeedback,
          handDetected: true,
          status: 'detecting',
          landmarks,
          detectedSign: null,
          confidence: 0,
        });
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    })();
  }, [videoRef]);

  useEffect(() => {
    if (!enabled) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setResult({
        feedback: 'Camera inactive',
        handDetected: false,
        status: 'idle',
        landmarks: null,
        detectedSign: null,
        confidence: 0,
      });
      return;
    }

    loadMediaPipe().then(() => {
      animFrameRef.current = requestAnimationFrame(processFrame);
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, loadMediaPipe, processFrame]);

  return result;
}