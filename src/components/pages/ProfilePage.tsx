import { useEffect, useState } from "react";
import { useOutletContext, Navigate } from "react-router";
import {
  LogOut,
  Mail,
  User,
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
  const { onNavigate, onLogout, onOpenAuth } = useOutletContext<LayoutOutletContext>();
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
          <div className="bg-slate-50 h-32 w-full border-b border-slate-100" />
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-4 flex justify-between items-end">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={displayName}
                  className="h-32 w-32 rounded-[1.75rem] border-4 border-white bg-white object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-[1.75rem] border-4 border-white bg-primary text-5xl font-bold text-primary-foreground shadow-sm">
                  {displayName[0]?.toUpperCase()}
                </div>
              )}
              <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => onLogout()}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-slate-950">{displayName}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> {profile.email}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Joined {joinDate}</span>
              </div>
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
