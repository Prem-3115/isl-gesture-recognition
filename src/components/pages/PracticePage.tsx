import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
  Activity,
  AlertCircle,
  BrainCircuit,
  Camera,
  Eye,
  RefreshCcw,
  Square,
  Trophy,
  X,
} from "lucide-react@0.487.0";
import islChart from "@/assets/isl_chart.jpg";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { LayoutOutletContext } from "@/types/layout";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export function PracticePage() {
  const { onNavigate } = useOutletContext<LayoutOutletContext>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const checkAPI = async () => {
      try {
        await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ landmarks: new Array(63).fill(0) }),
        });
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }
    };

    checkAPI();
    const interval = window.setInterval(checkAPI, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const gestureResult = useGestureRecognition({
    videoRef,
    enabled: cameraActive,
  });

  useEffect(() => {
    const score = Math.round((gestureResult.confidence ?? 0) * 100);
    setBestScore((current) => Math.max(current, score));
  }, [gestureResult.confidence]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera not supported in this browser.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      await videoRef.current.play();
      setCameraActive(true);
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      if (err.name === "NotAllowedError") {
        setCameraError("Permission denied. Check your browser camera permissions.");
      } else if (err.name === "NotFoundError") {
        setCameraError("No camera was found on this device.");
      } else if (err.name === "NotReadableError") {
        setCameraError("Your camera is already in use by another application.");
      } else {
        setCameraError(err.message ?? "Unable to start the camera.");
      }
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const liveScore = Math.round((gestureResult.confidence ?? 0) * 100);
  const masteryLevel = useMemo(() => {
    if (liveScore >= 90) return "Excellent";
    if (liveScore >= 75) return "Strong";
    if (liveScore >= 55) return "Developing";
    return "Warming up";
  }, [liveScore]);

  const statusTone =
    gestureResult.status === "loading"
      ? "bg-amber-400"
      : gestureResult.status === "feedback"
        ? "bg-emerald-500"
        : gestureResult.handDetected
          ? "bg-primary"
          : "bg-slate-400";

  const feedbackTone =
    liveScore >= 85
      ? "bg-emerald-500/90"
      : liveScore >= 60
        ? "bg-primary/90"
        : "bg-slate-500/90";

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">AI Practice</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Practice with gesture recognition for ISL</h1>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("dashboard")}>
            <X className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>

        {apiOnline === false && (
          <Alert className="mb-6 rounded-2xl border-destructive/20 bg-red-50">
            <Activity className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-red-900">Flask API is offline</AlertTitle>
            <AlertDescription className="text-red-800">
              Gesture recognition for ISL needs the local backend running on `http://127.0.0.1:5000`.
            </AlertDescription>
          </Alert>
        )}

        {cameraError && (
          <Alert className="mb-6 rounded-2xl border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Camera issue detected</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <span>{cameraError}</span>
              <Button size="sm" className="rounded-lg" onClick={startCamera}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-black shadow-2xl">
              <video
                ref={videoRef}
                playsInline
                muted
                className={`absolute inset-0 h-full w-full object-cover ${cameraActive ? "scale-x-[-1]" : "hidden"}`}
              />
              <div className={`absolute inset-0 ${cameraActive ? "bg-gradient-to-br from-slate-950/20 to-primary/20" : "bg-gradient-to-br from-slate-900 to-slate-950"}`} />

              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                  <Camera className="mb-4 h-16 w-16 text-white/50" />
                  <h2 className="text-2xl font-semibold">Camera inactive</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                    Start the real webcam flow to use the project&apos;s original MediaPipe and Flask-backed gesture recognition for ISL pipeline.
                  </p>
                  <div className="mt-6">
                    <Button className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90" size="lg" onClick={startCamera}>
                      Start Real Camera
                    </Button>
                  </div>
                </div>
              )}

              {cameraActive && (
                <>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className={`h-[68%] w-[72%] rounded-[1.75rem] border-2 border-dashed transition-all ${
                        gestureResult.handDetected
                          ? "border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.35)]"
                          : "border-white/25"
                      }`}
                    />
                  </div>

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusTone}`} />
                    {gestureResult.status}
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">
                    <BrainCircuit className="h-4 w-4" />
                    ISL recognizer active
                  </div>

                  <div className={`absolute left-4 top-16 max-w-sm rounded-2xl px-4 py-3 text-sm text-white shadow-lg ${feedbackTone}`}>
                    {gestureResult.feedback}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5">
                    <div className="mb-2 flex justify-between text-xs text-white/70">
                      <span>Recognition accuracy</span>
                      <span>{liveScore}%</span>
                    </div>
                    <Progress value={liveScore} className="h-2.5 bg-white/15" />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button variant="destructive" size="sm" className="rounded-xl" onClick={stopCamera}>
                        <Square className="mr-2 h-4 w-4" />
                        Stop Camera
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">Live Performance Analysis</h2>
                  <p className="text-sm text-slate-500">Driven by the real ISL recognition state</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Current Score", `${liveScore}%`],
                  ["Mastery Level", masteryLevel],
                  ["Best Score", `${bestScore}%`],
                  ["Detected Sign", gestureResult.detectedSign ?? "None"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-primary/8 via-secondary/8 to-accent/8 p-4 text-sm text-slate-600">
                <span className="font-medium text-slate-900">ISL recognizer feedback:</span> {gestureResult.feedback}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 shadow-lg shadow-primary/10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Detected Sign</p>
                  <p className="text-sm text-slate-500">Most recent recognizer output</p>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-5 text-center">
                <p className="text-4xl font-semibold text-slate-950">
                  {gestureResult.detectedSign ?? "--"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  {gestureResult.detectedSign ? "Detected from the live webcam feed" : "Waiting for a stable sign"}
                </p>
                <div className="mt-4">
                  <div className="mb-2 flex justify-between text-xs text-slate-500">
                    <span>Confidence</span>
                    <span>{liveScore}%</span>
                  </div>
                  <Progress value={liveScore} className="h-2.5 bg-slate-100" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Reference</p>
              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <img src={islChart} alt="ISL chart reference" className="w-full object-contain" loading="lazy" decoding="async" />
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Use the original chart bundled in the project as your visual ISL reference while testing recognition.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-950">System Status</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Camera</span>
                  <span className={cameraActive ? "text-emerald-600" : "text-slate-500"}>
                    {cameraActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">MediaPipe Model</span>
                  <span className={gestureResult.status === "loading" ? "text-amber-600" : "text-slate-700"}>
                    {gestureResult.status === "loading" ? "Loading" : "Ready"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Flask API</span>
                  <span className={apiOnline ? "text-emerald-600" : "text-red-600"}>
                    {apiOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hand Detection</span>
                  <span className={gestureResult.handDetected ? "text-emerald-600" : "text-slate-500"}>
                    {gestureResult.handDetected ? "Detected" : "Waiting"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-slate-950">Recognition Tips</h3>
              <div className="space-y-3">
                {[
                  "Use even lighting so ISL hand landmarks stay visible.",
                  "Keep one hand centered inside the dashed guide.",
                  "Hold the gesture steady for several frames so the prediction can stabilize.",
                  "Make sure the local Flask API is running before starting gesture recognition for ISL.",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                    <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-7 text-slate-600">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
