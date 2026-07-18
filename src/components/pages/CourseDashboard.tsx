import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Flame,
  Hand,
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

// Sign of the Day — cycles through the supported classes
const SUPPORTED_SIGNS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C"];
function getSignOfDay(): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000); // changes each UTC day
  return SUPPORTED_SIGNS[dayIndex % SUPPORTED_SIGNS.length];
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
    accent: "bg-slate-100",
    iconColor: "text-primary",
  },
  {
    title: "Daily Practice",
    description: "Use short webcam sessions to reinforce hand shape and orientation.",
    icon: Target,
    accent: "bg-slate-100",
    iconColor: "text-primary",
  },
  {
    title: "Build Your Streak",
    description: "One session a day is enough to keep the material fresh.",
    icon: Flame,
    accent: "bg-slate-100",
    iconColor: "text-primary",
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
          <h1 className="mt-2 text-4xl font-bold text-slate-950">
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
          <div className="col-span-2 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500">Your Level</p>
                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Level {level}</p>
                <p className="mt-0.5 text-sm font-medium text-slate-500">{xp} XP total · <span className="text-primary">{xpToNextLevel} XP</span> to next level</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200/50 text-2xl font-bold text-slate-900 shadow-sm ring-1 ring-slate-900/5">
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
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[1rem] bg-accent-secondary/10 ring-1 ring-accent-secondary/20">
              <Flame className="h-6 w-6 text-accent-secondary" />
            </div>
            <p className="text-3xl font-bold tracking-tight text-slate-950">{streak}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">Day streak</p>
            {streak >= 3 && (
              <p className="mt-2 flex items-center text-xs font-bold text-accent-secondary">
                <Flame className="mr-1 h-4 w-4" /> You're on a roll!
              </p>
            )}
          </div>

          {/* Overall Progress */}
          <div className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[1rem] bg-accent-secondary/10 ring-1 ring-accent-secondary/20">
              <Trophy className="h-6 w-6 text-accent-secondary" />
            </div>
            {completedCount === 0 ? (
              <div className="flex flex-1 flex-col justify-between">
                <p className="text-sm font-medium leading-relaxed text-slate-600">
                  Start your first lesson to track your progress here.
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-3 w-full rounded-xl"
                  onClick={() => onNavigate("lesson:letter-a")}
                >
                  Start Lesson
                </Button>
              </div>
            ) : (
              <>
                <p className="text-3xl font-bold tracking-tight text-slate-950">{completedCount}/{totalLessons}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">Lessons done</p>
                <div className="mt-auto pt-3">
                  <Progress value={overallProgress} className="h-2.5 bg-slate-100" />
                </div>
              </>
            )}
          </div>
        </section>

        {/* ── Sign of the Day + Continue ──────────────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.55fr]">
          {/* Continue Learning Hero */}
          <div className="group/hero relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 p-8 text-primary-foreground shadow-elevation transition-all hover:shadow-elevation-hover">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/4 translate-x-1/4 rounded-full bg-white/5 blur-3xl transition-transform duration-700 group-hover/hero:scale-110" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-slate-400">
                  <BookOpen className="h-4 w-4" />
                  Continue Learning
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {resumeLessonId === lessonList[0].id && completedCount === 0
                    ? "Start Your First Lesson"
                    : `Resume: ${lessonList.find((l) => l.id === resumeLessonId)?.title ?? "Next Lesson"}`}
                </h2>
                <p className="mt-3 leading-relaxed text-slate-300">
                  {completedCount === 0
                    ? "Jump into the ISL Alphabet course and sign your first letter today."
                    : `${completedCount} lesson${completedCount > 1 ? "s" : ""} completed · ${totalLessons - completedCount} remaining`}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  size="lg"
                  className="group/btn h-12 rounded-xl bg-white text-slate-950 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
                  onClick={() => onNavigate(`lesson:${resumeLessonId}`)}
                >
                  <span className="font-semibold">{completedCount === 0 ? "Start Now" : "Continue"}</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-10 rounded-xl border-white/20 bg-white/5 text-white backdrop-blur transition-colors hover:bg-white/10"
                  onClick={() => onNavigate("practice")}
                >
                  Open Practice
                </Button>
              </div>
            </div>
          </div>

          {/* Sign of the Day */}
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-elevation">
            <div className="relative">
              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Sign of the Day</p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] bg-gradient-to-br from-slate-100 to-slate-200/50 text-3xl font-bold text-slate-900 shadow-sm ring-1 ring-slate-900/5">
                  {signOfDay}
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight text-slate-950">Letter {signOfDay}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-500">Today's practice focus</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-slate-600">
                Practice signing <strong className="font-semibold text-slate-900">{signOfDay}</strong> in the recognition workspace to complete today's challenge.
              </p>
              <Button
                className="group/btn mt-5 w-full rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/95 active:scale-[0.98]"
                onClick={() => {
                  onNavigate("practice");
                }}
              >
                <Hand className="mr-2 h-4 w-4 transition-transform group-hover/btn:-rotate-12 group-hover/btn:scale-110" />
                <span className="font-medium">Practice {signOfDay} Now</span>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Focus Cards ─────────────────────────────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          {DASHBOARD_FOCUS.map((item) => (
            <div key={item.title} className="group rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 ring-1 ring-slate-900/5 transition-colors group-hover:bg-primary group-hover:text-white">
                <item.icon className="h-5 w-5 transition-colors group-hover:text-white" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </section>

        {/* ── Active Courses ──────────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Active Courses</h2>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("home")}>
              Browse More
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                image={course.image}
                difficulty={course.difficulty}
                index={index}
                onViewCourse={(id) => onNavigate(`course:${id}`)}
              />
            ))}
          </div>
        </section>

        {/* ── Recent Signs ────────────────────────────────────── */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Recently Practiced Signs</h2>
              <p className="mt-1 text-sm text-slate-500">Jump back into any sign for a quick refresher</p>
            </div>
            <Button variant="outline" className="rounded" onClick={() => onNavigate("practice")}>
              <Zap className="mr-2 h-4 w-4" />
              Open Practice
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
                      <Button size="sm" className="rounded bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onNavigate("practice")}>
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
