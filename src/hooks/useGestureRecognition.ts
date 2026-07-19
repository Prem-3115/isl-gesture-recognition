import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from '@mediapipe/tasks-vision';
import { type Landmark } from '../data/islSigns';
import { API_PREDICT } from '../lib/api';

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
  detectedSign: string | null;
  /** Confidence in range [0, 1]. 0 when no prediction or API offline. */
  confidence: number;
}

interface UseGestureRecognitionOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  enabled: boolean;
}

const MEDIAPIPE_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm';

let globalHandLandmarker: HandLandmarker | null = null;
let isModelLoading = false;

export function useGestureRecognition({
  videoRef,
  enabled,
}: UseGestureRecognitionOptions) {
  const animFrameRef = useRef<number | null>(null);
  const requestInFlightRef = useRef(false);
  const lastVideoTimeRef = useRef<number>(-1);
  const stablePredictionRef = useRef<string | null>(null);
  const stableCountRef = useRef<number>(0);
  const lastFeedbackRef = useRef<string>('Initializing...');
  const predictionHistory = useRef<Array<{ label: string; confidence: number }>>([]);

  const [result, setResult] = useState<GestureResult>({
    feedback: 'Initializing...',
    handDetected: false,
    status: 'idle',
    detectedSign: null,
    confidence: 0,
  });

  const predictFromAPI = async (landmarks: number[]) => {
    try {
      const res = await fetch(API_PREDICT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ landmarks }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error('API Error:', data);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Fetch Error:', err);
      return null;
    }
  };

  const loadMediaPipe = useCallback(async () => {
    if (globalHandLandmarker) {
      setResult(prev => ({
        ...prev,
        status: 'ready',
        feedback: 'Model ready! Show your hand.',
      }));
      return;
    }
    if (isModelLoading) {
      setResult(prev => ({ ...prev, status: 'loading', feedback: 'Loading AI model...' }));
      return;
    }

    isModelLoading = true;
    setResult(prev => ({ ...prev, status: 'loading', feedback: 'Loading AI model...' }));

    try {
      const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      globalHandLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numHands: 2,
      });
      isModelLoading = false;
      setResult(prev => ({
        ...prev,
        status: 'ready',
        feedback: 'Model ready! Show your hand.',
      }));
    } catch {
      isModelLoading = false;
      setResult(prev => ({
        ...prev,
        status: 'error',
        feedback: 'Failed to load AI model.',
      }));
    }
  }, []);

  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const landmarker = globalHandLandmarker;

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

    const handDetected = Boolean(mpResult.landmarks && mpResult.landmarks.length > 0);

    if (!handDetected) {
      predictionHistory.current = [];
      stablePredictionRef.current = null;
      stableCountRef.current = 0;
      requestInFlightRef.current = false;
      const newFeedback = 'No hand detected - show your hand to the camera';

      if (lastFeedbackRef.current !== newFeedback) {
        lastFeedbackRef.current = newFeedback;
        setResult(prev => ({
          ...prev,
          handDetected: false,
          status: 'detecting',
          feedback: newFeedback,
          detectedSign: null,
          confidence: 0,
        }));
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    // API expects 126 values: [left_hand (21×3), right_hand (21×3)]
    // Use zeros for any missing hand.
    const HAND_ZEROS = new Array(21 * 3).fill(0);
    let leftFlat: number[] = HAND_ZEROS;
    let rightFlat: number[] = HAND_ZEROS;

    const allLandmarks = mpResult.landmarks!;
    const handedness = mpResult.handedness ?? [];
    allLandmarks.forEach((hand, i) => {
      const flat = (hand as Landmark[]).flatMap(p => [p.x, p.y, p.z]);
      // MediaPipe reports handedness from camera perspective (mirrored), so
      // "Left" in MediaPipe == user's Right hand and vice-versa.
      // Handle both MediaPipe version typings (Category[][] vs Category[])
      const category: any = Array.isArray(handedness[i]) ? (handedness[i] as any)[0] : handedness[i];
      const label = category?.categoryName ?? category?.displayName ?? '';
      if (label === 'Left') {
        rightFlat = flat; // camera-left = user's right
      } else {
        leftFlat = flat;  // camera-right = user's left
      }
    });
    const flattened = [...leftFlat, ...rightFlat];

    if (requestInFlightRef.current) {
      animFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }
    requestInFlightRef.current = true;

    (async () => {
      const apiResult = await predictFromAPI(flattened);
      requestInFlightRef.current = false;

      if (apiResult) {
        if (apiResult.prediction === null || apiResult.prediction === undefined) {
          const conf = Math.round((apiResult.confidence ?? 0) * 100);
          const newFeedback = `Hand detected - hold steadier (${conf}%)`;

          if (lastFeedbackRef.current !== newFeedback) {
            lastFeedbackRef.current = newFeedback;
            setResult({
              feedback: newFeedback,
              handDetected: true,
              status: 'detecting',
              detectedSign: null,
              confidence: apiResult.confidence ?? 0,
            });
          }

          animFrameRef.current = requestAnimationFrame(processFrame);
          return;
        }

        const predicted = apiResult.prediction.trim().toUpperCase();
        const confidence = apiResult.confidence ?? 0;

        predictionHistory.current.push({ label: predicted, confidence });
        if (predictionHistory.current.length > 5) {
          predictionHistory.current.shift();
        }

        const weightedScores: Record<string, number> = {};
        predictionHistory.current.forEach(entry => {
          weightedScores[entry.label] =
            (weightedScores[entry.label] || 0) + entry.confidence;
        });

        const bestPrediction = Object.keys(weightedScores).reduce((a, b) =>
          weightedScores[a] > weightedScores[b] ? a : b
        );

        if (stablePredictionRef.current === bestPrediction) {
          stableCountRef.current += 1;
        } else {
          stablePredictionRef.current = bestPrediction;
          stableCountRef.current = 1;
        }

        if (stableCountRef.current >= 4) {
          const conf = Math.round(confidence * 100);
          const newFeedback = `Detected: ${bestPrediction} (${conf}% confidence)`;

          if (lastFeedbackRef.current !== newFeedback) {
            lastFeedbackRef.current = newFeedback;
            setResult({
              feedback: newFeedback,
              handDetected: true,
              status: 'feedback',
              detectedSign: bestPrediction,
              confidence,
            });
          }
        }

        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const newFeedback = 'Flask API not responding — is it running on port 5000?';
      if (lastFeedbackRef.current !== newFeedback) {
        lastFeedbackRef.current = newFeedback;
        setResult({
          feedback: newFeedback,
          handDetected: true,
          status: 'error',
          detectedSign: null,
          confidence: 0,
        });
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    })();
  }, [videoRef]);

  // Pre-load the model eagerly so it's ready before the camera starts.
  // FIX: Single useEffect — the original had a duplicate useEffect block.
  useEffect(() => {
    loadMediaPipe();
  }, [loadMediaPipe]);

  useEffect(() => {
    if (!enabled) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      requestInFlightRef.current = false;
      setResult({
        feedback: 'Camera inactive',
        handDetected: false,
        status: 'idle',
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
      requestInFlightRef.current = false;
    };
  }, [enabled, loadMediaPipe, processFrame]);

  return result;
}
