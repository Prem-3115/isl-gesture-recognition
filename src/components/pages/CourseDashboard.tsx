import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Flame,
  Hand,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { courses, lessonList, recentSigns } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { useAuth } from "@/context/AuthContext";
import { fetchCompletedLessons } from "@/services/progress.service";
import { CourseCard } from "../CourseCard";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

// Sign of the Day — cycles through the alphabet daily
const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function getSignOfDay(): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000); // changes each UTC day
  return ALL_LETTERS[dayIndex % ALL_LETTERS.length];
}

// XP per lesson
const XP_PER_LESSON = 50;

// Streak from localStorage
function getStreak(): number {
  try {
    const data = JSON.parse(localStorage.getItem("isl_streak") ?? "{}") as { count?: number; lastDate?: string };
    const today = new Date().toDateString();
    if (data.lastDate === today) return data.count ?? 0;
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    if (data.lastDate === yesterday) return data.count ?? 0; // streak still valid today
    return 0; // broken
  } catch { return 0; }
}

function updateStreak() {
  try {
    const data = JSON.parse(localStorage.getItem("isl_streak") ?? "{}") as { count?: number; lastDate?: string };
    const today = new Date().toDateString();
    if (data.lastDate === today) return; // already updated today
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    const newCount = data.lastDate === yesterday ? (data.count ?? 0) + 1 : 1;
    localStorage.setItem("isl_streak", JSON.stringify({ count: newCount, lastDate: today }));
  } catch { /* ignore */ }
}

const DASHBOARD_FOCUS = [
  {
    title: "Continue Learning",
    description: "Pick up where you left off and move into the next guided sign.",
    icon: BookOpen,
    accent: "from-primary/10 via-secondary/10 to-accent/10",
    iconColor: "text-primary",
  },
  {
    title: "Daily Practice",
    description: "Use short webcam sessions to reinforce hand shape and orientation.",
    icon: Target,
    accent: "from-secondary/10 via-accent/10 to-primary/10",
    iconColor: "text-secondary",
  },
  {
    title: "Build Your Streak",
    description: "One session a day is enough to keep the material fresh.",
    icon: Flame,
    accent: "from-accent/10 via-primary/10 to-secondary/10",
    iconColor: "text-accent",
  },
] as const;

export function CourseDashboard() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();
  const { user } = useAuth();

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [streak] = useState(getStreak);
  const signOfDay = getSignOfDay();

  // Update daily streak on mount
  useEffect(() => { updateStreak(); }, []);

  // Load Firestore progress
  useEffect(() => {
    if (!user?.uid) return;
    fetchCompletedLessons(user.uid)
      .then(setCompletedLessons)
      .catch(() => { /* fallback: empty set */ });
  }, [user?.uid]);

  const completedCount = completedLessons.size;
  const totalLessons = lessonList.length;
  const xp = completedCount * XP_PER_LESSON;
  const level = Math.floor(xp / 200) + 1;
  const xpToNextLevel = 200 - (xp % 200);
  const xpProgress = Math.round(((xp % 200) / 200) * 100);

  const resumeLessonId = lessonList.find((l) => !completedLessons.has(l.id))?.id ?? lessonList[0].id;
  const overallProgress = Math.round((completedCount / totalLessons) * 100);

  const greetingTime = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-950">
            {greetingTime}, {userName} 👋
          </h1>
          <p className="mt-2 text-slate-500">
            {completedCount === 0
              ? "Your learning journey starts here. Let's sign!"
              : `You've completed ${completedCount} of ${totalLessons} lessons — keep going!`}
          </p>
        </div>

        {/* ── XP + Streak Banner ──────────────────────────────── */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* XP Level */}
          <div className="col-span-2 overflow-hidden rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Your Level</p>
                <p className="mt-1 text-3xl font-bold text-slate-950">Level {level}</p>
                <p className="mt-0.5 text-sm text-slate-500">{xp} XP total · {xpToNextLevel} XP to next level</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary to-secondary text-2xl font-bold text-white shadow-lg">
                {level}
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-slate-500">
                <span>XP Progress</span>
                <span>{xpProgress}%</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-slate-100" aria-label={`XP progress: ${xpProgress}%`} />
            </div>
          </div>

          {/* Streak */}
          <div className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-slate-950">{streak}</p>
            <p className="mt-1 text-sm text-slate-500">Day streak</p>
            {streak >= 3 && (
              <p className="mt-2 text-xs font-medium text-orange-500">🔥 You're on a roll!</p>
            )}
          </div>

          {/* Overall Progress */}
          <div className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">
              <Trophy className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-slate-950">{completedCount}/{totalLessons}</p>
            <p className="mt-1 text-sm text-slate-500">Lessons done</p>
            <div className="mt-3">
              <Progress value={overallProgress} className="h-2 bg-slate-100" />
            </div>
          </div>
        </section>

        {/* ── Sign of the Day + Continue ──────────────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.55fr]">
          {/* Continue Learning Hero */}
          <div className="bg-gradient-brand relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl">
            <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-black/10 blur-3xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="mb-2 flex items-center gap-2 text-sm text-white/80">
                  <BookOpen className="h-4 w-4" />
                  Continue Learning
                </p>
                <h2 className="text-3xl font-semibold">
                  {resumeLessonId === lessonList[0].id && completedCount === 0
                    ? "Start Your First Lesson"
                    : `Resume: ${lessonList.find((l) => l.id === resumeLessonId)?.title ?? "Next Lesson"}`}
                </h2>
                <p className="mt-2 text-white/75">
                  {completedCount === 0
                    ? "Jump into the ISL Alphabet course and sign your first letter today."
                    : `${completedCount} lesson${completedCount > 1 ? "s" : ""} completed · ${totalLessons - completedCount} remaining`}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90"
                  onClick={() => onNavigate(`lesson:${resumeLessonId}`)}
                >
                  {completedCount === 0 ? "Start Now" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl bg-white/15 text-white hover:bg-white/25"
                  onClick={() => onNavigate("practice")}
                >
                  Open Practice
                </Button>
              </div>
            </div>
          </div>

          {/* Sign of the Day */}
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 shadow-lg shadow-primary/10">
            <div className="absolute right-2 top-2 opacity-10">
              <Star className="h-24 w-24 text-primary" />
            </div>
            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Sign of the Day</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary to-secondary text-4xl font-bold text-white shadow-lg">
                  {signOfDay}
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-950">Letter {signOfDay}</p>
                  <p className="mt-1 text-sm text-slate-500">Today's practice focus</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Practice signing <strong>{signOfDay}</strong> in the recognition workspace to complete today's challenge.
              </p>
              <Button
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                onClick={() => {
                  // Navigate to practice and let the user switch to challenge mode for this letter
                  onNavigate("practice");
                }}
              >
                <Hand className="mr-2 h-4 w-4" />
                Practice {signOfDay} Now
              </Button>
            </div>
          </div>
        </section>

        {/* ── Focus Cards ─────────────────────────────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          {DASHBOARD_FOCUS.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent}`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        {/* ── Active Courses ──────────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">Active Courses</h2>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("home")}>
              Browse More
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                image={course.image}
                difficulty={course.difficulty}
                onViewCourse={(id) => onNavigate(`course:${id}`)}
              />
            ))}
          </div>
        </section>

        {/* ── Recent Signs ────────────────────────────────────── */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Recently Practiced Signs</h2>
              <p className="mt-1 text-sm text-slate-500">Jump back into any sign for a quick refresher</p>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("practice")}>
              <Zap className="mr-2 h-4 w-4" />
              Open Practice
            </Button>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sign</TableHead>
                  <TableHead>Last Practiced</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSigns.map((item) => (
                  <TableRow key={item.sign}>
                    <TableCell>
                      <span className="font-medium text-slate-900">{item.sign}</span>
                    </TableCell>
                    <TableCell className="text-slate-500">{item.lastPracticed}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" className="rounded-lg" onClick={() => onNavigate("practice")}>
                        Practice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
