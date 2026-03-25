import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
  AlertCircle,
  BrainCircuit,
  Camera,
  CircleHelp,
  Eye,
  RefreshCcw,
  ScanSearch,
  SkipForward,
  Square,
  Trophy,
  X,
} from "lucide-react@0.487.0";
import { LayoutOutletContext } from "@/types/layout";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

type PracticeMode = "camera" | "demo" | null;
type DetectionPhase = {
  label: string;
  feedback: string;
  detected: boolean;
  score: number;
  signal: "gray" | "yellow" | "purple" | "green";
};

const phases: DetectionPhase[] = [
  {
    label: "Waiting for hand",
    feedback: "Center your hand inside the guide to begin recognition.",
    detected: false,
    score: 12,
    signal: "gray",
  },
  {
    label: "Scanning shape",
    feedback: "Good framing. Hold still while the AI checks finger position.",
    detected: true,
    score: 48,
    signal: "yellow",
  },
  {
    label: "Comparing sign",
    feedback: "Thumb placement looks close. Slightly tighten the fist for a clearer A.",
    detected: true,
    score: 73,
    signal: "purple",
  },
  {
    label: "Strong match",
    feedback: "Excellent handshape. This looks like a confident Letter A.",
    detected: true,
    score: 92,
    signal: "green",
  },
] as const;

const statusTone = {
  gray: "bg-slate-400",
  yellow: "bg-amber-400",
  purple: "bg-primary",
  green: "bg-emerald-500",
} as const;

const statusBadgeTone = {
  gray: "bg-slate-500/85",
  yellow: "bg-amber-500/90",
  purple: "bg-primary/90",
  green: "bg-emerald-500/90",
} as const;

export function PracticePage() {
  const { onNavigate } = useOutletContext<LayoutOutletContext>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<PracticeMode>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [sessionProgress, setSessionProgress] = useState(66);

  const currentPhase = phases[phaseIndex];
  const isCameraActive = mode === "camera";
  const isDemoMode = mode === "demo";

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (!mode) return;

    const interval = window.setInterval(() => {
      setPhaseIndex((index) => (index + 1) % phases.length);
      setSessionProgress((progress) => (progress >= 100 ? 100 : progress + 2));
    }, 2400);

    return () => window.clearInterval(interval);
  }, [mode]);

  useEffect(() => () => stopStream(), [stopStream]);

  const startCamera = async () => {
    setCameraError(null);
    setPhaseIndex(0);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser does not support camera access. Try demo mode instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMode("camera");
    } catch {
      setCameraError("Camera access failed. Check permissions or switch to demo mode.");
      stopStream();
    }
  };

  const stopCamera = () => {
    stopStream();
    setMode(null);
    setPhaseIndex(0);
  };

  const startDemoMode = () => {
    stopStream();
    setCameraError(null);
    setPhaseIndex(0);
    setMode("demo");
  };

  const performanceSummary = useMemo(() => {
    const level = currentPhase.score >= 90 ? "Excellent" : currentPhase.score >= 75 ? "Strong" : currentPhase.score >= 50 ? "Developing" : "Warm-up";
    const tip =
      currentPhase.score >= 90
        ? "Keep this handshape steady for one more second before moving on."
        : currentPhase.score >= 75
          ? "Your overall sign is strong. Focus on making the thumb line cleaner."
          : "Slow down and keep your hand centered before adjusting finger shape.";

    return {
      level,
      tip,
      best: 94,
    };
  }, [currentPhase.score]);

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">AI Practice</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950">Practice Letter A with live guidance</h1>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("dashboard")}>
            <X className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>

        {cameraError && (
          <Alert className="mb-6 rounded-2xl border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-900">Camera issue detected</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <span>{cameraError}</span>
              <Button size="sm" className="rounded-lg" onClick={startDemoMode}>
                Try Demo Mode
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-black shadow-2xl">
              <video ref={videoRef} playsInline muted className={`absolute inset-0 h-full w-full object-cover ${isCameraActive ? "scale-x-[-1]" : "hidden"}`} />
              <div className={`absolute inset-0 ${!mode ? "bg-gradient-to-br from-slate-900 to-slate-950" : "bg-gradient-to-br from-slate-950/20 to-primary/20"}`} />

              {!mode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
                  <Camera className="mb-4 h-16 w-16 text-white/50" />
                  <h2 className="text-2xl font-semibold">Camera inactive</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
                    Start your real camera for webcam practice or use demo mode to preview the AI recognition flow.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90" size="lg" onClick={startCamera}>
                      Start Real Camera
                    </Button>
                    <Button variant="outline" className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" size="lg" onClick={startDemoMode}>
                      Try Demo Mode
                    </Button>
                  </div>
                </div>
              )}

              {isDemoMode && (
                <div className="absolute inset-0 flex items-center justify-center text-[7rem] animate-pulse">
                  🤟
                </div>
              )}

              {mode && (
                <>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className={`h-[68%] w-[72%] rounded-[1.75rem] border-2 border-dashed transition-all ${
                        currentPhase.detected
                          ? "border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.35)]"
                          : "border-white/25"
                      }`}
                    />
                  </div>

                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusTone[currentPhase.signal]}`} />
                    {currentPhase.label}
                  </div>

                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-white backdrop-blur">
                    <BrainCircuit className="h-4 w-4" />
                    AI recognition active
                  </div>

                  <div className={`absolute left-4 top-16 max-w-sm rounded-2xl px-4 py-3 text-sm text-white shadow-lg ${statusBadgeTone[currentPhase.signal]}`}>
                    {currentPhase.feedback}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5">
                    <div className="mb-2 flex justify-between text-xs text-white/70">
                      <span>Recognition accuracy</span>
                      <span>{currentPhase.score}%</span>
                    </div>
                    <Progress value={currentPhase.score} className="h-2.5 bg-white/15" />
                    <div className="mt-4 flex flex-wrap gap-3">
                      {isCameraActive && (
                        <Button variant="destructive" size="sm" className="rounded-xl" onClick={stopCamera}>
                          <Square className="mr-2 h-4 w-4" />
                          Stop Camera
                        </Button>
                      )}
                      {isDemoMode && (
                        <Button variant="outline" size="sm" className="rounded-xl border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white" onClick={() => setMode(null)}>
                          Exit Demo Mode
                        </Button>
                      )}
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
                  <h2 className="text-2xl font-semibold text-slate-950">AI Performance Analysis</h2>
                  <p className="text-sm text-slate-500">A mocked feedback panel that cycles through detection phases</p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  ["Current Score", `${currentPhase.score}%`],
                  ["Mastery Level", performanceSummary.level],
                  ["Best Score", `${performanceSummary.best}%`],
                  ["Status", currentPhase.detected ? "Hand detected" : "Waiting"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-gradient-to-r from-primary/8 via-secondary/8 to-accent/8 p-4 text-sm text-slate-600">
                <span className="font-medium text-slate-900">AI tip:</span> {performanceSummary.tip}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Reference Sign</p>
              <div className="mt-4 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 text-7xl">
                ✊
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">Letter A</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">Make a firm fist and keep the thumb resting on the outside edge of the fingers.</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-950">Session Progress</h3>
                <span className="text-sm text-slate-500">{sessionProgress}%</span>
              </div>
              <Progress value={sessionProgress} className="h-2.5 bg-slate-100" />
              <p className="mt-3 text-sm text-slate-500">3 of 4 feedback phases completed in this simulated session.</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-slate-950">Controls</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="justify-start rounded-xl" onClick={() => setPhaseIndex(0)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Repeat
                </Button>
                <Button variant="outline" className="justify-start rounded-xl">
                  <CircleHelp className="mr-2 h-4 w-4" />
                  Help
                </Button>
                <Button variant="outline" className="justify-start rounded-xl">
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip
                </Button>
                <Button className="bg-gradient-brand justify-start rounded-xl border-0 text-white hover:opacity-90" onClick={() => setPhaseIndex((phaseIndex + 1) % phases.length)}>
                  <ScanSearch className="mr-2 h-4 w-4" />
                  Next
                </Button>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-slate-950">AI Recognition Tips</h3>
              <div className="space-y-3">
                {[
                  "Use even lighting so finger outlines stay clear.",
                  "Keep your hand centered inside the guide box.",
                  "Hold the sign for one second before changing position.",
                  "Use demo mode if you want to preview the recognition flow first.",
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
