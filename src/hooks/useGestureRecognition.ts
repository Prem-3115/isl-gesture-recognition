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

// Pinned to match the installed @mediapipe/tasks-vision package version
const MEDIAPIPE_WASM_URL =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.33/wasm';

/** Number of recent predictions kept for temporal smoothing */
const HISTORY_SIZE = 7;
/** Exponential decay weight for older predictions (recent predictions count more) */
const PREDICTION_DECAY = 0.7;


let globalHandLandmarker: HandLandmarker | null = null;
let isModelLoading = false;

export function useGestureRecognition({
  videoRef,
  enabled,
}: UseGestureRecognitionOptions) {
  const animFrameRef = useRef<number | null>(null);
  const requestInFlightRef = useRef(false);
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
          // GPU uses WebGL for 3-5x faster landmark inference than CPU
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        // Track 2 hands: improves detection robustness when the off-hand
        // is partially visible, and enables dominant-hand selection below.
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

    // Capture timestamp once for this frame.
    // Fix #12: pass the same `now` to detectForVideo to guarantee a
    // monotonically consistent timestamp with the loop's throttle check.
    const now = performance.now();

    let mpResult: HandLandmarkerResult;
    try {
      mpResult = landmarker.detectForVideo(video, now);
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

    // We now extract both hands (42 landmarks, 126 features).
    // MediaPipe's 'Left' and 'Right' labels are consistent.
    // 'Left' -> landmarks 0-20, 'Right' -> landmarks 21-41.
    const flattened = new Array(126).fill(0);
    
    if (mpResult.handedness && mpResult.landmarks) {
      for (let i = 0; i < mpResult.handedness.length; i++) {
        const handLabel = mpResult.handedness[i]?.[0]?.categoryName; // "Left" or "Right"
        const landmarks = mpResult.landmarks[i] as Landmark[];
        
        if (handLabel && landmarks) {
          const isRight = handLabel === "Right";
          const offset = isRight ? 63 : 0;
          
          for (let j = 0; j < landmarks.length; j++) {
            flattened[offset + j * 3] = landmarks[j].x;
            flattened[offset + j * 3 + 1] = landmarks[j].y;
            flattened[offset + j * 3 + 2] = landmarks[j].z;
          }
        }
      }
    }
    
    // Flatten all landmarks for the UI to draw both hands
    const landmarks = (mpResult.landmarks || []).flat() as Landmark[];

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

          // Fix #5: clear stale history on ambiguous frames so they cannot
          // ghost-predict old signs when confidence recovers on the next frame.
          predictionHistory.current = [];
          stablePredictionRef.current = null;
          stableCountRef.current = 0;

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
        if (predictionHistory.current.length > HISTORY_SIZE) {
          predictionHistory.current.shift();
        }

        // Exponential decay: the most recent prediction gets weight 1.0,
        // older predictions get weight PREDICTION_DECAY^age. This means a
        // transition from sign A → sign B converges faster than a flat window.
        const histLen = predictionHistory.current.length;
        const weightedScores: Record<string, number> = {};
        const totalWeights: Record<string, number> = {};
        predictionHistory.current.forEach((entry, idx) => {
          const recencyWeight = Math.pow(PREDICTION_DECAY, histLen - 1 - idx);
          weightedScores[entry.label] =
            (weightedScores[entry.label] || 0) + entry.confidence * recencyWeight;
          // Track sum of weights per label so we can normalise to a true average
          totalWeights[entry.label] = (totalWeights[entry.label] || 0) + recencyWeight;
        });

        const bestPrediction = Object.keys(weightedScores).reduce((a, b) =>
          weightedScores[a] > weightedScores[b] ? a : b
        );

        // Fix #7: smoothed confidence = weighted average of confidences for
        // the winning label across history, NOT the raw last-frame value.
        // This ensures the displayed % always matches bestPrediction.
        const smoothedConfidence =
          weightedScores[bestPrediction] / totalWeights[bestPrediction];

        if (stablePredictionRef.current === bestPrediction) {
          stableCountRef.current += 1;
        } else {
          stablePredictionRef.current = bestPrediction;
          stableCountRef.current = 1;
        }

        // Threshold: 2 consecutive matching predictions is enough to confirm
        // stability while still feeling responsive.
        if (stableCountRef.current >= 2) {
          const conf = Math.round(smoothedConfidence * 100);
          const newFeedback = `Detected: ${bestPrediction} (${conf}% confidence)`;

          if (lastFeedbackRef.current !== newFeedback) {
            lastFeedbackRef.current = newFeedback;
            setResult({
              feedback: newFeedback,
              handDetected: true,
              status: 'feedback',
              detectedSign: bestPrediction,
              confidence: smoothedConfidence,
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
