import { useEffect, useMemo, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Pause,
  Play,
  Volume2,
} from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";
import islChart from "@/assets/isl_chart.jpg";
import { LayoutOutletContext } from "@/types/layout";
import { Button } from "../ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const lessonMeta: Record<string, { title: string; emoji: string }> = {
  "letter-a": { title: "Letter A", emoji: "📘" },
  "letter-b": { title: "Letter B", emoji: "📘" },
  "letter-c": { title: "Letter C", emoji: "📘" },
  "letter-d": { title: "Letter D", emoji: "📘" },
  "letter-e": { title: "Letter E", emoji: "📘" },
};

export function LessonPage() {
  const { lessonId = "letter-a" } = useParams();
  const { onNavigate } = useOutletContext<LayoutOutletContext>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(12);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const lesson = useMemo(() => lessonMeta[lessonId] ?? lessonMeta["letter-a"], [lessonId]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = window.setInterval(() => {
      setVideoProgress((previous) => {
        const next = previous + 2;
        if (next >= 100) {
          window.clearInterval(interval);
          setIsPlaying(false);
          setLessonCompleted(true);
          toast.success("Lesson complete. You're ready for practice.");
          return 100;
        }
        return next;
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const handleMarkComplete = () => {
    setLessonCompleted(true);
    setVideoProgress(100);
    setIsPlaying(false);
    toast.success("Lesson marked complete.");
  };

  const elapsed = `${Math.floor((videoProgress / 100) * 6)}:${String(Math.floor(((videoProgress / 100) * 60) % 60)).padStart(2, "0")}`;

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate("home")} className="cursor-pointer">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate("dashboard")} className="cursor-pointer">Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate("course:alphabet")} className="cursor-pointer">ISL Alphabet</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-slate-950">{lesson.title}</h1>
            <p className="mt-2 text-slate-600">Lesson 2 of 10 · Learn ISL Alphabet</p>
          </div>
          {lessonCompleted ? (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
              Completed
            </div>
          ) : (
            <Button variant="outline" className="rounded-xl" onClick={handleMarkComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark Complete
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.85fr]">
          <div>
            <div className="group relative mb-6 aspect-video overflow-hidden rounded-[1.75rem] bg-black shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950 to-primary/30" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-8xl">{lesson.emoji}</div>
                <p className="mt-4 text-sm uppercase tracking-[0.25em] text-white/70">ISL lesson preview</p>
                <p className="mt-1 text-lg text-white/90">Follow the ISL reference chart in the visual reference panel</p>
              </div>
              {!isPlaying && videoProgress < 100 && (
                <button onClick={() => setIsPlaying(true)} className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl transition hover:scale-105">
                    <Play className="ml-1 h-8 w-8" />
                  </div>
                </button>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100">
                <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="bg-gradient-brand h-full transition-all duration-300" style={{ width: `${videoProgress}%` }} />
                </div>
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying((current) => !current)}>
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>
                    <button>
                      <Volume2 className="h-5 w-5" />
                    </button>
                    <span className="text-sm">{elapsed} / 6:30</span>
                  </div>
                  <button>
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("course:alphabet")}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous Lesson
              </Button>
              <Button className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90" onClick={() => onNavigate("lesson:letter-b")}>
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-slate-950">How to Practice This ISL Sign</h2>
              <div className="space-y-3">
                {[
                  ["Handshape", "Follow the ISL reference chart in the visual reference panel and keep the handshape clear and deliberate."],
                  ["Movement", "Position your hand clearly as per ISL guidelines and keep the gesture steady before transitioning."],
                  ["Palm Orientation", "Match the palm direction shown in the ISL chart so the sign stays visually readable."],
                  ["Common Mistakes", "Avoid rushing the gesture or changing finger position before the handshape is fully formed."],
                ].map(([label, description]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-primary">{label}</p>
                    <p className="text-sm leading-7 text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-slate-950">Visual Reference</h3>
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <img src={islChart} alt="ISL chart reference" className="w-full object-contain" loading="lazy" decoding="async" />
              </div>
              <p className="mt-4 text-center text-sm text-slate-500">Refer to the ISL chart for accurate gestures.</p>
            </div>

            <Button className="bg-gradient-brand h-12 w-full rounded-xl border-0 text-white hover:opacity-90" size="lg" onClick={() => onNavigate("practice")}>
              Practice This Sign
            </Button>
          </div>
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-primary/10 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
          <h2 className="mb-4 text-2xl font-semibold text-slate-950">Key Learning Points</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              "Follow the ISL reference chart in the visual reference panel before practicing.",
              "Position your hand clearly as per ISL guidelines and keep the gesture readable.",
              "Focus on clear handshape, palm direction, and timing rather than speed.",
              "Refer to the ISL chart for accurate gestures before using AI webcam feedback.",
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-2xl bg-white/70 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <p className="text-sm leading-7 text-slate-600">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
