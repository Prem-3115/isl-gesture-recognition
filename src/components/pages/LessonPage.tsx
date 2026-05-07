import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
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

interface LessonMeta {
  title: string;
  description: string;
  youtubeId: string;
  channel: string;
}

const lessonMeta: Record<string, LessonMeta> = {
  "intro-isl": {
    title: "Introduction to ISL",
    description: "An overview of Indian Sign Language — its history, structure, and how to get started.",
    youtubeId: "5PF6JXzYyUI",
    channel: "ISLRTC",
  },
  "letter-a": {
    title: "Letter A",
    description: "Learn how to sign the letter A in Indian Sign Language.",
    youtubeId: "u_ZTEXA_WX4",
    channel: "SignAble Communications",
  },
  "letter-b": {
    title: "Letter B",
    description: "Learn how to sign the letter B in Indian Sign Language.",
    youtubeId: "ieWVWx9ykb8",
    channel: "SignAble Communications",
  },
  "letter-c": {
    title: "Letter C",
    description: "Learn how to sign the letter C in Indian Sign Language.",
    youtubeId: "zmZ8E1O34pQ",
    channel: "SignAble Communications",
  },
  "letter-d": {
    title: "Letter D",
    description: "Learn how to sign the letter D in Indian Sign Language.",
    youtubeId: "cMzyA5kiFI4",
    channel: "SignAble Communications",
  },
  "letter-e": {
    title: "Letter E",
    description: "Learn how to sign the letter E in Indian Sign Language.",
    youtubeId: "GM5U69TAQ0c",
    channel: "SignAble Communications",
  },
  "letter-f": {
    title: "Letter F",
    description: "Learn how to sign the letter F in Indian Sign Language.",
    youtubeId: "1wKAw-aCP44",
    channel: "SignAble Communications",
  },
  "letter-g": {
    title: "Letter G",
    description: "Learn how to sign the letter G in Indian Sign Language.",
    youtubeId: "Ez8rwyZvclA",
    channel: "SignAble Communications",
  },
  "letter-h": {
    title: "Letter H",
    description: "Learn how to sign the letter H in Indian Sign Language.",
    youtubeId: "T2DVNMM5hmc",
    channel: "SignAble Communications",
  },
  "letter-i": {
    title: "Letter I",
    description: "Learn how to sign the letter I in Indian Sign Language.",
    youtubeId: "cGZRNgzl7Ks",
    channel: "SignAble Communications",
  },
  "letter-j": {
    title: "Letter J",
    description: "Learn how to sign the letter J in Indian Sign Language.",
    youtubeId: "CKoTMog47Eo",
    channel: "SignAble Communications",
  },
  "letter-k": {
    title: "Letter K",
    description: "Learn how to sign the letter K in Indian Sign Language.",
    youtubeId: "0QphTAjEJaI",
    channel: "SignAble Communications",
  },
  "letter-l": {
    title: "Letter L",
    description: "Learn how to sign the letter L in Indian Sign Language.",
    youtubeId: "uh4T_jmc4Sw",
    channel: "SignAble Communications",
  },
  "letter-m": {
    title: "Letter M",
    description: "Learn how to sign the letter M in Indian Sign Language.",
    youtubeId: "c3vj8iQpabg",
    channel: "SignAble Communications",
  },
  "letter-n": {
    title: "Letter N",
    description: "Learn how to sign the letter N in Indian Sign Language.",
    youtubeId: "thLt0HRBzKI",
    channel: "SignAble Communications",
  },
  "letter-o": {
    title: "Letter O",
    description: "Learn how to sign the letter O in Indian Sign Language.",
    youtubeId: "YuHPc6obYlQ",
    channel: "SignAble Communications",
  },
  "letter-p": {
    title: "Letter P",
    description: "Learn how to sign the letter P in Indian Sign Language.",
    youtubeId: "XOIHxWPt_UE",
    channel: "SignAble Communications",
  },
  "letter-q": {
    title: "Letter Q",
    description: "Learn how to sign the letter Q in Indian Sign Language.",
    youtubeId: "7wMVH7iJUNI",
    channel: "SignAble Communications",
  },
  "letter-r": {
    title: "Letter R",
    description: "Learn how to sign the letter R in Indian Sign Language.",
    youtubeId: "0Lk7_fKVCdk",
    channel: "SignAble Communications",
  },
  "letter-s": {
    title: "Letter S",
    description: "Learn how to sign the letter S in Indian Sign Language.",
    youtubeId: "PDbfw8isOos",
    channel: "SignAble Communications",
  },
  "letter-t": {
    title: "Letter T",
    description: "Learn how to sign the letter T in Indian Sign Language.",
    youtubeId: "4YI_bXVHgnk",
    channel: "SignAble Communications",
  },
  "letter-u": {
    title: "Letter U",
    description: "Learn how to sign the letter U in Indian Sign Language.",
    youtubeId: "qcdivQfA41Y",
    channel: "SignAble Communications",
  },
  "letter-v": {
    title: "Letter V",
    description: "Learn how to sign the letter V in Indian Sign Language.",
    youtubeId: "XaHVxkbbO40",
    channel: "SignAble Communications",
  },
  "letter-w": {
    title: "Letter W",
    description: "Learn how to sign the letter W in Indian Sign Language.",
    youtubeId: "aKLUMUQim-I",
    channel: "SignAble Communications",
  },
  "letter-x": {
    title: "Letter X",
    description: "Learn how to sign the letter X in Indian Sign Language.",
    youtubeId: "XtcoBPj_lhI",
    channel: "SignAble Communications",
  },
  "letter-y": {
    title: "Letter Y",
    description: "Learn how to sign the letter Y in Indian Sign Language.",
    youtubeId: "gf76kRO7Jb4",
    channel: "SignAble Communications",
  },
  "letter-z": {
    title: "Letter Z",
    description: "Learn how to sign the letter Z in Indian Sign Language.",
    youtubeId: "VdwKSyza5oI",
    channel: "ISLRTC",
  },
};

const lessonKeys = Object.keys(lessonMeta);


export function LessonPage() {
  const { lessonId = "letter-a" } = useParams();
  const { onNavigate } = useOutletContext<LayoutOutletContext>();
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const lesson = lessonMeta[lessonId] ?? null;
  const lessonIndex = lesson ? lessonKeys.indexOf(lessonId) : -1;
  const lessonNumber = lessonIndex + 1;
  const totalLessons = lessonKeys.length;
  const prevLessonId = lessonIndex > 0 ? lessonKeys[lessonIndex - 1] : null;
  const nextLessonId = lessonIndex < lessonKeys.length - 1 ? lessonKeys[lessonIndex + 1] : null;

  useEffect(() => {
    document.title = lesson
      ? `${lesson.title} — ISL Connect`
      : "Lesson Not Found — ISL Connect";
  }, [lesson]);

  const handleMarkComplete = () => {
    setLessonCompleted(true);
    toast.success("Lesson marked complete! Ready to practice?");
  };

  // BUG-003: Clear not-found state for unknown lesson IDs
  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-6xl mb-6">🔍</p>
        <h1 className="text-3xl font-semibold text-slate-950">Lesson not found</h1>
        <p className="mt-3 text-slate-600 max-w-md">
          The lesson{" "}
          <code className="rounded bg-slate-100 px-2 py-0.5 text-sm">{lessonId}</code>{" "}
          doesn't exist yet. Choose a lesson from the course page.
        </p>
        <Button
          className="mt-6 bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90"
          onClick={() => onNavigate("dashboard")}
        >
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate("home")} className="cursor-pointer">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => onNavigate("dashboard")} className="cursor-pointer">
                Courses
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{lesson.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              ISL Alphabet · Lesson {lessonNumber} of {totalLessons}
            </p>
            <h1 className="text-4xl font-semibold text-slate-950">{lesson.title}</h1>
            <p className="mt-2 text-slate-500">{lesson.description}</p>
          </div>
          {lessonCompleted ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-emerald-700" role="status">
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">Completed</span>
            </div>
          ) : (
            <Button variant="outline" className="rounded-xl" onClick={handleMarkComplete}>
              <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Mark Complete
            </Button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_0.85fr]">
          <div>
            {/* ── YouTube Video Player ─────────────────────────────────── */}
            <div
              className="relative mb-6 overflow-hidden rounded-[1.75rem] bg-black shadow-2xl"
              style={{ aspectRatio: "16/9" }}
              role="region"
              aria-label={`Lesson video: ${lesson.title}`}
            >
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1&color=white`}
                title={`${lesson.title} — Indian Sign Language tutorial`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
              />
            </div>

            {/* Source credit */}
            <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-500">
                Video by <span className="font-medium text-slate-700">{lesson.channel}</span> on YouTube
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm font-medium text-primary transition hover:opacity-80"
                aria-label={`Open ${lesson.title} video on YouTube`}
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Watch on YouTube
              </a>
            </div>

            {/* Prev / Next nav */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                className="rounded-xl"
                disabled={!prevLessonId}
                onClick={() => prevLessonId && onNavigate(`lesson:${prevLessonId}`)}
              >
                <ChevronLeft className="mr-2 h-4 w-4" aria-hidden="true" />
                Previous
              </Button>
              <Button
                className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90"
                disabled={!nextLessonId}
                onClick={() => nextLessonId && onNavigate(`lesson:${nextLessonId}`)}
              >
                Next Lesson
                <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            {/* How-to tips */}
            <div className="mt-8 rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold text-slate-950">How to Practice This Sign</h2>
              <div className="space-y-3">
                {[
                  ["Watch carefully", "Watch the video at least twice — once to observe, once to follow along."],
                  ["Handshape", "Pay close attention to finger positions and palm orientation in the video."],
                  ["Mirror practice", "Use a mirror or your phone's front camera to compare your hand to the sign."],
                  ["Test with AI", "Once you're confident, use the Practice page to test recognition with our ISL AI model."],
                ].map(([label, description]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="mb-1 text-sm font-medium text-primary">{label}</p>
                    <p className="text-sm leading-7 text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-6">
            {/* ISL Chart */}
            <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Visual Reference
              </p>
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <img
                  src={islChart}
                  alt="ISL alphabet chart showing hand gestures for all 26 letters A through Z"
                  className="w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <p className="mt-4 text-center text-sm text-slate-500">
                Use this chart alongside the video for reference.
              </p>
            </div>

            {/* Practice CTA */}
            <Button
              className="bg-gradient-brand h-12 w-full rounded-xl border-0 text-white hover:opacity-90"
              size="lg"
              onClick={() => onNavigate("practice")}
            >
              Practice This Sign with AI
            </Button>

            {/* Key points */}
            <div className="rounded-[1.5rem] border border-primary/10 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-950">Key Learning Points</h3>
              <div className="space-y-3">
                {[
                  "Watch the full video before attempting the sign.",
                  "Match the exact handshape and palm direction shown.",
                  "Hold the sign steady before moving to the next letter.",
                  "Use the ISL chart alongside the video for reference.",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl bg-white/70 p-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" aria-hidden="true" />
                    <p className="text-sm leading-6 text-slate-600">{point}</p>
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
