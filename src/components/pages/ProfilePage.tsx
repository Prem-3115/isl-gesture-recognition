import { useEffect, useState } from "react";
import { useOutletContext, Navigate } from "react-router";
import {
  LogOut,
  Mail,
  Calendar,
  Flame,
  Zap,
  BookOpen,
  Award,
} from "lucide-react";
import { LayoutOutletContext } from "@/types/layout";
import { useAuth } from "@/context/AuthContext";
import { fetchCompletedLessons } from "@/services/progress.service";
import { lessonList } from "@/data/mockData";
import { Button } from "../ui/button";

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

export function ProfilePage() {
  const { onNavigate, onLogout } = useOutletContext<LayoutOutletContext>();
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const streak = getStreak();

  useEffect(() => {
    if (!user?.uid) return;
    fetchCompletedLessons(user.uid)
      .then(setCompletedLessons)
      .catch(() => { /* silent fallback */ });
  }, [user?.uid]);

  // Auth Guard: if auth is loaded and there is no user, redirect to home and trigger login modal via Layout state (or just redirect for now)
  if (!isAuthLoading && !user) {
    return <Navigate to="/?auth=login" replace />;
  }

  if (isAuthLoading || !profile) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl animate-pulse space-y-8">
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

  // Derive stats
  const completedCount = completedLessons.size;
  const totalLessons = lessonList.length;
  const xp = completedCount * XP_PER_LESSON;
  const level = Math.floor(xp / 200) + 1;

  // Simple badge calculation logic replicated from Achievements
  const dynamicAchievements = [
    { earned: completedCount >= 1 },
    { earned: completedCount >= 10 },
    { earned: completedCount >= Math.floor(totalLessons / 2) },
    { earned: completedCount >= totalLessons },
    { earned: streak >= 3 },
    { earned: streak >= 7 },
    { earned: xp >= 500 },
    { earned: xp >= 1000 },
  ];
  const badgesCount = dynamicAchievements.filter((a) => a.earned).length;

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const displayName = profile.displayName || profile.email?.split("@")[0] || "ISL Learner";

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        
        {/* Profile Header */}
        <section className="bg-white overflow-hidden rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="relative h-32 w-full bg-slate-950 overflow-hidden">
            {/* Subtle ambient glows */}
            <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-[50px]" />
            <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-indigo-500/20 blur-[50px]" />
            {/* Subtle dot pattern overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
          </div>
          <div className="relative px-8 pb-8">
            <div className="relative flex justify-between">
              <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white text-4xl font-bold text-primary shadow-sm ring-4 ring-white overflow-hidden">
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  displayName[0]?.toUpperCase()
                )}
              </div>
              <Button variant="outline" className="mt-4" onClick={() => onLogout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-slate-900">{displayName}</h1>
              <p className="mt-1 text-slate-500">
                <Mail className="mr-1 inline h-4 w-4" /> {profile.email}
                <span className="mx-2">·</span>
                <Calendar className="mr-1 inline h-4 w-4" /> Joined {joinDate}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500 font-medium">
              <Flame className="h-5 w-5 text-orange-500" /> Day Streak
            </div>
            <p className="text-3xl font-bold text-slate-900">{streak}</p>
          </div>
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500 font-medium">
              <Zap className="h-5 w-5 text-yellow-500" /> Total XP
            </div>
            <p className="text-3xl font-bold text-slate-900">{xp} <span className="text-sm font-normal text-slate-400">/ Level {level}</span></p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2 text-slate-500 font-medium">
              <BookOpen className="h-5 w-5 text-primary" /> Lessons
            </div>
            <p className="text-3xl font-bold text-slate-900">{completedCount} <span className="text-sm font-normal text-slate-400">/ {totalLessons}</span></p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onNavigate("achievements")}>
            <div className="flex items-center gap-3 mb-2 text-slate-500 font-medium">
              <Award className="h-5 w-5 text-accent-secondary" /> Badges
            </div>
            <p className="text-3xl font-bold text-slate-900">{badgesCount}</p>
          </div>
        </section>

      </div>
    </div>
  );
}
