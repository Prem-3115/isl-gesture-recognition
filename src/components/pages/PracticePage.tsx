import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
  AlertCircle,
  BrainCircuit,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  RefreshCcw,
  Shuffle,
  Square,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import islChart from "@/assets/isl_chart.jpg";
import { useGestureRecognition } from "@/hooks/useGestureRecognition";
import { useStreak } from "@/hooks/useStreak";
import { API_HEALTH } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { logDisabledLessonAccess } from "@/services/progress.service";
import type { LayoutOutletContext } from "@/types/layout";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

// ─── Constants ──────────────────────────────────────────────────────────────

const ALL_SIGNS = [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
  "1","2","3","4","5","6","7","8","9",
];

const SUPPORTED_SIGNS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C"];

// ─── Confetti Component ──────────────────────────────────────────────────────

interface Particle {
  id: number;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

function Confetti({ active }: { active: boolean }) {
  const particles = useMemo<Particle[]>(() => {
    const colors = ["#8B5CF6","#EC4899","#06B6D4","#F59E0B","#10B981","#6366F1"];
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 0.5,
      duration: 1.2 + Math.random() * 0.8,
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute top-0 animate-bounce"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `translateY(-20px) rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Circular Score Ring ─────────────────────────────────────────────────────

function ScoreRing({
  score,
  label,
  color = "#8B5CF6",
  size = 88,
}: {
  score: number;
  label: string;
  color?: string;
  size?: number;
}) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={10}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="circle-progress"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900"
          style={{ fontSize: size < 80 ? "0.85rem" : undefined }}
        >
          {score}%
        </span>
      </div>
      <span className="text-center text-xs text-slate-500">{label}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

type PracticeMode = "free" | "challenge";

export function PracticePage() {
  const { onNavigate } = useOutletContext<LayoutOutletContext>();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera + API state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  // Practice mode
  const [mode, setMode] = useState<PracticeMode>("free");
  const [targetSign, setTargetSign] = useState<string>("A");
  const [targetIndex, setTargetIndex] = useState(0);

  // Session stats
  const [sessionBest, setSessionBest] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.title = "Practice — ISL Connect";
  }, []);

  // Health check
  useEffect(() => {
    const checkAPI = async () => {
      try {
        const res = await fetch(API_HEALTH);
        const data = await res.json();
        setApiOnline(res.ok && data.model_loaded === true);
      } catch {
        setApiOnline(false);
      }
    };
    checkAPI();
    if (!cameraActive) return;
    const interval = window.setInterval(checkAPI, 5000);
    return () => window.clearInterval(interval);
  }, [cameraActive]);

  const gestureResult = useGestureRecognition({ videoRef, enabled: cameraActive });
  const liveScore = Math.round((gestureResult.confidence ?? 0) * 100);

  // Streak tracking (only in challenge mode)
  const { streak, resetStreak } = useStreak(
    mode === "challenge" ? gestureResult.detectedSign : null,
    mode === "challenge" ? targetSign : null,
  );

  // Update session best score
  useEffect(() => {
    setSessionBest((prev) => Math.max(prev, liveScore));
  }, [liveScore]);

  // Celebrate milestone streaks
  useEffect(() => {
    if (!streak.milestone) return;
    toast.success(`${streak.milestone}-streak! You're on fire!`, {
      icon: <Flame className="h-5 w-5 text-orange-500" />,
      duration: 3000,
    });
  }, [streak.milestone]);

  // Confetti on correct detection in challenge mode
  const prevCorrectRef = useRef(false);
  useEffect(() => {
    if (mode !== "challenge") return;
    const isCorrect =
      !!gestureResult.detectedSign &&
      gestureResult.detectedSign.toUpperCase() === targetSign.toUpperCase() &&
      liveScore >= 55;

    if (isCorrect && !prevCorrectRef.current) {
      // New correct detection — show confetti briefly
      setShowConfetti(true);
      if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = setTimeout(() => setShowConfetti(false), 1500);
    }
    prevCorrectRef.current = isCorrect;
  }, [gestureResult.detectedSign, targetSign, liveScore, mode]);

  useEffect(() => () => {
    if (confettiTimerRef.current) clearTimeout(confettiTimerRef.current);
  }, []);

  // Camera controls
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera not supported in this browser.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (!videoRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      await videoRef.current.play();
      setCameraActive(true);
    } catch (error: unknown) {
      const err = error as { name?: string; message?: string };
      if (err.name === "NotAllowedError") setCameraError("Permission denied. Check your browser camera permissions.");
      else if (err.name === "NotFoundError") setCameraError("No camera was found on this device.");
      else if (err.name === "NotReadableError") setCameraError("Your camera is already in use by another app.");
      else setCameraError(err.message ?? "Unable to start the camera.");
    }
  };

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // Challenge navigation
  const goToSign = useCallback((index: number) => {
    const newIndex = Math.max(0, Math.min(ALL_SIGNS.length - 1, index));
    const sign = ALL_SIGNS[newIndex];
    setTargetIndex(newIndex);
    setTargetSign(sign);
    resetStreak();
    
    if (!SUPPORTED_SIGNS.includes(sign) && user?.uid) {
      logDisabledLessonAccess(user.uid, sign).catch(console.error);
    }
  }, [resetStreak, user?.uid]);

  const randomSign = useCallback(() => {
    const current = targetIndex;
    let next = Math.floor(Math.random() * ALL_SIGNS.length);
    while (next === current) next = Math.floor(Math.random() * ALL_SIGNS.length);
    goToSign(next);
  }, [targetIndex, goToSign]);

  // Derived visual state
  const masteryLevel = useMemo(() => {
    if (liveScore >= 90) return { label: "Excellent", color: "text-emerald-600" };
    if (liveScore >= 75) return { label: "Strong", color: "text-blue-600" };
    if (liveScore >= 55) return { label: "Developing", color: "text-violet-600" };
    return { label: "Warming up", color: "text-slate-400" };
  }, [liveScore]);

  const isSupportedTarget = SUPPORTED_SIGNS.includes(targetSign);

  const filteredDetectedSign = gestureResult.detectedSign && SUPPORTED_SIGNS.includes(gestureResult.detectedSign.toUpperCase()) 
    ? gestureResult.detectedSign 
    : null;

  const isCorrectInChallenge =
    mode === "challenge" &&
    !!filteredDetectedSign &&
    filteredDetectedSign.toUpperCase() === targetSign.toUpperCase() &&
    liveScore >= 55;

  const statusTone =
    gestureResult.status === "loading" ? "bg-amber-400" :
    gestureResult.status === "error" ? "bg-red-500" :
    gestureResult.status === "feedback" ? "bg-emerald-500" :
    gestureResult.handDetected ? "bg-primary" : "bg-slate-400";

  const feedbackBg =
    isCorrectInChallenge ? "bg-emerald-500/90" :
    liveScore >= 85 ? "bg-emerald-500/90" :
    liveScore >= 60 ? "bg-primary/90" : "bg-slate-500/90";

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">AI Practice</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Practice with Gesture Recognition
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Mode toggle */}
            <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${mode === "free" ? "bg-primary text-primary-foreground" : "text-slate-600 hover:bg-slate-50"}`}
                onClick={() => { setMode("free"); resetStreak(); }}
                aria-pressed={mode === "free"}
              >
                <Eye className="h-4 w-4" />
                Free Practice
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${mode === "challenge" ? "bg-primary text-primary-foreground" : "text-slate-600 hover:bg-slate-50"}`}
                onClick={() => setMode("challenge")}
                aria-pressed={mode === "challenge"}
              >
                <Target className="h-4 w-4" />
                Challenge Mode
              </button>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("dashboard")}>
              <X className="mr-2 h-4 w-4" />
              Exit
            </Button>
          </div>
        </div>

        {/* ── Dev-only API indicator (never shown in production) ─── */}
        {import.meta.env.DEV && apiOnline === false && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Dev: Flask API offline — run <code className="font-mono text-xs">python isl_api.py</code> on port 5000</span>
          </div>
        )}

        {cameraError && (
          <Alert className="mb-6 rounded-2xl border-amber-200 bg-amber-50" role="alert">
            <AlertCircle className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <AlertTitle className="text-amber-900">Camera issue</AlertTitle>
            <AlertDescription className="flex flex-col gap-3 text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <span>{cameraError}</span>
              <Button size="sm" className="rounded-lg" onClick={startCamera}>
                <RefreshCcw className="mr-2 h-4 w-4" />Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* ── Challenge Target Banner ────────────────────────────────── */}
        {mode === "challenge" && (
          <div className={`mb-6 overflow-hidden rounded-[1.75rem] shadow-lg transition-all ${isCorrectInChallenge ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-primary"}`}>
            <div className="relative px-6 py-5">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex flex-col items-center gap-4 text-primary-foreground sm:flex-row sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white/25 text-3xl font-bold shadow-lg">
                    {targetSign}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary-foreground/80">Target Sign</p>
                    <p className="text-2xl font-semibold">
                      {targetSign.length === 1 && !["1","2","3","4","5","6","7","8","9"].includes(targetSign)
                        ? `Letter ${targetSign}`
                        : `Number ${targetSign}`}
                    </p>
                    {isCorrectInChallenge && (
                      <p className="mt-1 flex items-center text-sm font-medium text-primary-foreground/90">
                        <Check className="mr-1 h-4 w-4" /> Correct! Hold it steady…
                      </p>
                    )}
                  </div>
                </div>

                {/* Streak counters */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Flame className="h-5 w-5 text-orange-300" />
                      {streak.current}
                    </p>
                    <p className="text-xs text-primary-foreground/70">Current streak</p>
                  </div>
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Trophy className="h-5 w-5 text-yellow-300" />
                      {streak.best}
                    </p>
                    <p className="text-xs text-primary-foreground/70">Best streak</p>
                  </div>
                  <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-2xl font-bold">
                      <Zap className="h-5 w-5 text-cyan-300" />
                      {streak.totalCorrect}
                    </p>
                    <p className="text-xs text-primary-foreground/70">Total correct</p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToSign(targetIndex - 1)}
                    disabled={targetIndex === 0}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 transition hover:bg-white/30 disabled:opacity-40"
                    aria-label="Previous sign"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={randomSign}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 transition hover:bg-white/30"
                    aria-label="Random sign"
                  >
                    <Shuffle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => goToSign(targetIndex + 1)}
                    disabled={targetIndex === ALL_SIGNS.length - 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 transition hover:bg-white/30 disabled:opacity-40"
                    aria-label="Next sign"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Sign picker pills */}
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {ALL_SIGNS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => goToSign(i)}
                    aria-label={`Practice sign ${s}`}
                    aria-pressed={s === targetSign}
                    className={`h-8 w-8 rounded-lg text-sm font-semibold transition ${s === targetSign ? "bg-white text-primary shadow" : "bg-white/15 text-primary-foreground/80 hover:bg-white/25"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main Grid ──────────────────────────────────────────────── */}
        <div className="grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="space-y-6">

            {/* Camera feed */}
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-black shadow-2xl"
              role="region"
              aria-label="Webcam gesture recognition feed"
            >
              <video
                ref={videoRef}
                playsInline
                muted
                aria-label="Live webcam feed"
                className={`absolute inset-0 h-full w-full object-cover ${cameraActive ? "scale-x-[-1]" : "hidden"}`}
              />
              <div className={`absolute inset-0 ${cameraActive ? "bg-gradient-to-br from-slate-950/10 to-primary/15" : "bg-gradient-to-br from-slate-900 to-slate-950"}`} />

              {/* Confetti celebration */}
              <Confetti active={showConfetti} />

              {/* Inactive state */}
              {!cameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-primary-foreground">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white/10">
                    <Camera className="h-10 w-10 text-primary-foreground/60" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold">Camera inactive</h2>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-primary-foreground/60">
                    {mode === "challenge" && !isSupportedTarget
                      ? `The sign "${targetSign}" requires two hands and is currently unsupported by the AI. We are tracking requests to prioritize it!`
                      : mode === "challenge"
                        ? `Start your camera and practice signing "${targetSign}". The AI will track your accuracy in real time.`
                        : "Start the camera to begin real-time ISL gesture recognition with MediaPipe and the ML model. Note: Only 1-9 and C are currently supported."}
                  </p>
                  <div className="mt-6">
                    <Button
                      className="bg-primary rounded-xl border-0 px-8 text-primary-foreground hover:opacity-90 disabled:opacity-50"
                      size="lg"
                      onClick={startCamera}
                      disabled={mode === "challenge" && !isSupportedTarget}
                    >
                      {mode === "challenge" && !isSupportedTarget ? "AI Practice Coming Soon" : "Start Camera"}
                    </Button>
                  </div>
                </div>
              )}

              {cameraActive && mode === "challenge" && !isSupportedTarget && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 px-6 text-center text-primary-foreground z-10">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-amber-500/20">
                    <AlertCircle className="h-10 w-10 text-amber-400" aria-hidden="true" />
                  </div>
                  <h2 className="text-2xl font-bold text-amber-400">Two-Handed Sign</h2>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-primary-foreground/80">
                    The sign <strong>"{targetSign}"</strong> is a two-handed sign. Our current AI model only supports one-handed tracking. We've logged your interest!
                  </p>
                  <div className="mt-6">
                    <Button
                      className="bg-white/10 rounded-xl border border-white/20 px-8 text-primary-foreground hover:bg-white/20"
                      onClick={randomSign}
                    >
                      Try a supported sign
                    </Button>
                  </div>
                </div>
              )}

              {cameraActive && (
                <>
                  {/* Hand guide box */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className={`h-[68%] w-[72%] rounded-[1.75rem] border-2 border-dashed transition-all duration-300 ${
                        isCorrectInChallenge
                          ? "border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.5)]"
                          : gestureResult.handDetected
                            ? "border-primary/60 shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                            : "border-white/20"
                      }`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Big detected sign overlay in challenge mode */}
                  {mode === "challenge" && filteredDetectedSign && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <div
                        className={`flex h-24 w-24 items-center justify-center rounded-[1.75rem] text-5xl font-bold text-primary-foreground shadow-2xl transition-all ${
                          isCorrectInChallenge ? "bg-emerald-500/80 scale-110" : "bg-black/40 scale-100"
                        }`}
                        style={{ transition: "all 0.2s ease" }}
                      >
                        {filteredDetectedSign}
                      </div>
                    </div>
                  )}

                  {/* Status pill */}
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-primary-foreground backdrop-blur" aria-live="polite">
                    <span className={`h-2.5 w-2.5 rounded-full ${statusTone}`} aria-hidden="true" />
                    {gestureResult.status}
                  </div>

                  {/* AI badge */}
                  <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 text-xs text-primary-foreground backdrop-blur">
                    <BrainCircuit className="h-4 w-4" aria-hidden="true" />
                    ISL recognizer active
                  </div>

                  {/* Feedback bubble */}
                  <div className={`absolute left-4 top-16 max-w-sm rounded-2xl px-4 py-3 text-sm text-primary-foreground shadow-lg ${feedbackBg} transition-colors`} aria-live="polite">
                    {gestureResult.feedback}
                  </div>

                  {/* Bottom bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-5">
                    <div className="mb-2 flex justify-between text-xs text-primary-foreground/70">
                      <span>Confidence</span>
                      <span className={isCorrectInChallenge ? "text-emerald-400 font-semibold" : ""}>{liveScore}%</span>
                    </div>
                    <Progress
                      value={liveScore}
                      className="h-2.5 bg-white/15"
                      aria-label={`Recognition confidence: ${liveScore}%`}
                    />
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button variant="destructive" size="sm" className="rounded-xl" onClick={stopCamera}>
                        <Square className="mr-2 h-4 w-4" />Stop Camera
                      </Button>
                      {mode === "challenge" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="rounded-xl bg-white/15 text-primary-foreground hover:bg-white/25"
                          onClick={randomSign}
                        >
                          <Shuffle className="mr-2 h-4 w-4" />Random Sign
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ── Performance Panel ─────────────────────────────────── */}
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                  <Trophy className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">Live Performance</h2>
                  <p className="text-sm text-slate-500">Real-time ISL recognition stats</p>
                </div>
              </div>

              {/* Score rings */}
              <div className="flex flex-wrap justify-around gap-6 rounded-2xl bg-slate-50 p-5">
                <ScoreRing score={liveScore} label="Live Score" color="#8B5CF6" />
                <ScoreRing score={sessionBest} label="Session Best" color="#EC4899" />
                {mode === "challenge" && (
                  <ScoreRing
                    score={streak.totalCorrect > 0 ? Math.min(100, Math.round((streak.totalCorrect / Math.max(1, streak.totalCorrect + 5)) * 100)) : 0}
                    label="Accuracy Rate"
                    color="#06B6D4"
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full border-[10px] border-emerald-200">
                    <span className="text-center text-sm font-bold leading-tight text-slate-900">
                      {filteredDetectedSign ?? "--"}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Detected</span>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-r from-primary/8 via-secondary/8 to-accent/8 p-4">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">Mastery Level</p>
                  <p className={`mt-1 text-lg font-semibold ${masteryLevel.color}`}>{masteryLevel.label}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4" aria-live="polite">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500">AI Feedback</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{gestureResult.feedback || "Waiting for hand…"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Detected sign card */}
            <div className="rounded-[1.75rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 shadow-lg shadow-primary/10">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-md">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Detected Sign</p>
                  <p className="text-xs text-slate-500">Most recent recognizer output</p>
                </div>
              </div>

              <div
                className={`rounded-[1.5rem] border p-6 text-center transition-all ${
                  isCorrectInChallenge
                    ? "border-emerald-300 bg-emerald-50 shadow-lg shadow-emerald-100"
                    : "border-white/70 bg-white/90"
                }`}
              >
                <p
                  className={`text-6xl font-bold transition-all ${isCorrectInChallenge ? "text-emerald-600" : "text-slate-950"}`}
                  aria-live="polite"
                  aria-atomic="true"
                  style={{ lineHeight: 1.1 }}
                >
                  {filteredDetectedSign ?? "--"}
                </p>
                {isCorrectInChallenge && (
                  <p className="mt-2 flex items-center justify-center text-sm font-semibold text-emerald-600">
                    <Check className="mr-1 h-4 w-4" /> Matches target!
                  </p>
                )}
                {!isCorrectInChallenge && filteredDetectedSign && mode === "challenge" && (
                  <p className="mt-2 text-sm text-slate-500">Looking for: <span className="font-bold text-primary">{targetSign}</span></p>
                )}
                {!filteredDetectedSign && (
                  <p className="mt-2 text-sm text-slate-400">Waiting for stable sign…</p>
                )}
                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                    <span>Confidence</span>
                    <span>{liveScore}%</span>
                  </div>
                  <Progress value={liveScore} className="h-2.5 bg-slate-100" />
                </div>
              </div>
            </div>

            {/* ISL Chart */}
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">ISL Reference Chart</p>
              <div className="mt-3 overflow-hidden rounded-[1.25rem] border border-slate-100">
                <img
                  src={islChart}
                  alt="ISL alphabet chart — hand gestures for all 26 letters A–Z"
                  className="w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-3 text-xs leading-6 text-slate-500">
                Compare your hand shape with the chart while practicing.
              </p>
            </div>

            {/* System status */}
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-slate-950">System Status</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Camera", value: cameraActive ? "Active" : "Inactive", ok: cameraActive },
                  { label: "MediaPipe", value: gestureResult.status === "loading" ? "Loading…" : "Ready", ok: gestureResult.status !== "loading" && gestureResult.status !== "error" },
                  { label: "Flask API", value: apiOnline == null ? "Checking…" : apiOnline ? "Online" : "Offline", ok: !!apiOnline },
                  { label: "Hand Detected", value: gestureResult.handDetected ? "Yes" : "No", ok: gestureResult.handDetected },
                ].map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span className="text-slate-500">{label}</span>
                    <span className={`font-medium ${ok ? "text-emerald-600" : "text-slate-400"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-slate-950">Recognition Tips</h3>
              <div className="space-y-3">
                {[
                  "Use even lighting so hand landmarks stay visible.",
                  "Keep one hand centered inside the dashed guide.",
                  "Hold the gesture steady for 4+ frames to stabilize.",
                  mode === "challenge"
                    ? "Challenge Mode: hold the correct sign until the border turns green!"
                    : "Try Challenge Mode to practice a specific letter with live scoring.",
                ].map((tip) => (
                  <div key={tip} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
                    <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <p className="text-sm leading-6 text-slate-600">{tip}</p>
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
