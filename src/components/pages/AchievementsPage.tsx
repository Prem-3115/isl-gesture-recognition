import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Flame,
  Sparkles,
  Target,
  Trophy,
  Zap,
  Check,
} from "lucide-react";
import { achievements, challengingSigns, lessonList } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { useAuth } from "@/context/AuthContext";
import { fetchCompletedLessons } from "@/services/progress.service";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const XP_PER_LESSON = 50;

function getStreak(): number {
  try {
    const data = JSON.parse(localStorage.getItem("isl_streak") ?? "{}") as { count?: number; lastDate?: string };
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86_400_000).toDateString();
    if (data.lastDate === today || data.lastDate === yesterday) return data.count ?? 0;
    return 0;
  } catch { return 0; }
}

export function AchievementsPage() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const streak = getStreak();

  useEffect(() => {
    if (!user?.uid) return;
    fetchCompletedLessons(user.uid)
      .then(setCompletedLessons)
      .catch(() => { /* silent fallback */ });
  }, [user?.uid]);

  const completedCount = completedLessons.size;
  const totalLessons = lessonList.length;
  const xp = completedCount * XP_PER_LESSON;
  const level = Math.floor(xp / 200) + 1;
  const xpProgress = Math.round(((xp % 200) / 200) * 100);

  // Dynamic achievements based on real data
  const dynamicAchievements = [
    {
      name: "First Step",
      description: "Completed your very first ISL lesson.",
      icon: Sparkles,
      earned: completedCount >= 1,
      progress: Math.min(100, completedCount * 100),
    },
    {
      name: "Alphabet Apprentice",
      description: "Completed 10 ISL alphabet lessons.",
      icon: BookOpen,
      earned: completedCount >= 10,
      progress: Math.min(100, Math.round((completedCount / 10) * 100)),
    },
    {
      name: "Halfway There",
      description: `Completed half the course (${Math.floor(totalLessons / 2)} lessons).`,
      icon: Target,
      earned: completedCount >= Math.floor(totalLessons / 2),
      progress: Math.min(100, Math.round((completedCount / Math.floor(totalLessons / 2)) * 100)),
    },
    {
      name: "Full Alphabet",
      description: "Completed every lesson in the ISL Connect curriculum.",
      icon: Trophy,
      earned: completedCount >= totalLessons,
      progress: Math.round((completedCount / totalLessons) * 100),
    },
    {
      name: "Streak Starter",
      description: "Practiced for 3 consecutive days.",
      icon: Flame,
      earned: streak >= 3,
      progress: Math.min(100, Math.round((streak / 3) * 100)),
    },
    {
      name: "Dedicated Learner",
      description: "Maintained a 7-day learning streak.",
      icon: Award,
      earned: streak >= 7,
      progress: Math.min(100, Math.round((streak / 7) * 100)),
    },
    {
      name: "XP Milestone: 500",
      description: "Earned 500 XP through lesson completions.",
      icon: Zap,
      earned: xp >= 500,
      progress: Math.min(100, Math.round((xp / 500) * 100)),
    },
    {
      name: "XP Milestone: 1000",
      description: "Earned 1000 XP — true mastery in the making.",
      icon: Award,
      earned: xp >= 1000,
      progress: Math.min(100, Math.round((xp / 1000) * 100)),
    },
  ];

  const earnedCount = dynamicAchievements.filter((a) => a.earned).length;

  if (isAuthLoading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="h-48 w-full rounded-[2rem] bg-slate-200/60" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
            <div className="h-32 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Profile Banner ───────────────────────────────────── */}
        <section className="bg-primary relative mb-8 overflow-hidden rounded-[2rem] p-8 text-primary-foreground shadow-2xl">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-black/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white/20 text-5xl font-bold shadow-lg">
              {(userName?.[0] ?? "P").toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold">{userName}</h1>
              <p className="mt-1 text-primary-foreground/70">Level {level} ISL Learner · {xp} XP</p>
              <div className="mt-3 w-full max-w-xs">
                <div className="mb-1 flex justify-between text-xs text-primary-foreground/70">
                  <span>XP Progress</span>
                  <span>{200 - (xp % 200)} XP to Level {level + 1}</span>
                </div>
                <Progress value={xpProgress} className="h-2 bg-white/20" />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                  <Flame className="mr-1 h-4 w-4" /> {streak}-day streak
                </span>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> {completedCount}/{totalLessons} lessons
                </span>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
                  <Trophy className="mr-1 h-4 w-4" /> {earnedCount}/{dynamicAchievements.length} badges
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Real Stats ──────────────────────────────────────── */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Lessons Completed", value: `${completedCount}`, sub: `of ${totalLessons} total`, icon: CheckCircle2, color: "text-accent-secondary", bg: "bg-accent-secondary/15" },
            { label: "Total XP Earned", value: `${xp}`, sub: `Level ${level}`, icon: Zap, color: "text-violet-600", bg: "bg-violet-100" },
            { label: "Day Streak", value: `${streak}`, sub: streak >= 3 ? "On a roll!" : "Keep going!", icon: Flame, color: "text-accent-secondary", bg: "bg-accent-secondary/15" },
            { label: "Badges Earned", value: `${earnedCount}`, sub: `of ${dynamicAchievements.length} available`, icon: Award, color: "text-accent-secondary", bg: "bg-accent-secondary/15" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold text-slate-950">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{stat.label}</p>
              <p className="text-xs text-slate-400">{stat.sub}</p>
            </div>
          ))}
        </section>

        {/* ── Achievements Grid ────────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Learning Highlights</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
              {earnedCount}/{dynamicAchievements.length} earned
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {dynamicAchievements.map((item, index) => (
              <div
                key={item.name}
                className={`card-enter rounded-[1.5rem] border p-5 transition-all ${
                  item.earned
                    ? "border-accent-secondary/30 bg-gradient-to-br from-accent-secondary/10 to-white shadow-sm shadow-accent-secondary/10"
                    : "border-white/70 bg-white opacity-70"
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${item.earned ? "bg-accent-secondary/15" : "bg-slate-100"}`}>
                  <item.icon className={`h-6 w-6 ${item.earned ? "text-accent-secondary" : "text-slate-400"}`} />
                </div>
                <h3 className="text-base font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
                {item.earned ? (
                  <p className="mt-3 flex items-center gap-1 text-xs font-medium text-accent-secondary">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Earned
                  </p>
                ) : (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-slate-400">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-1.5 bg-slate-100" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Static Achievements ──────────────────────────────── */}
        <section className="mb-8">
          <h2 className="mb-5 text-2xl font-bold text-slate-950">ISL Learning Milestones</h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item, index) => (
              <div
                key={item.name}
                className="card-enter rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-elevation-hover"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">{item.description}</p>
                {"earned" in item && item.earned && (
                  <p className="mt-3 flex items-center text-xs font-bold text-accent-secondary">
                    <Check className="mr-1 h-3 w-3" />
                    {"date" in item ? item.date : ""}
                  </p>
                )}
                {"progress" in item && !item.earned && (
                  <div className="mt-3">
                    <Progress value={"progress" in item ? item.progress : 0} className="h-1.5 bg-slate-100" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Suggested Review ──────────────────────────────────── */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">Suggested Review Signs</h2>
            <p className="mt-1 text-slate-500">Signs worth revisiting in your next practice session</p>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sign</TableHead>
                  <TableHead>Practice Note</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challengingSigns.map((item) => (
                  <TableRow key={item.sign}>
                    <TableCell className="font-medium">{item.sign}</TableCell>
                    <TableCell className="text-slate-500">{item.note}</TableCell>
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
