import { useOutletContext } from "react-router";
import { Award, BookOpen, Flame, Target, TrendingUp } from "lucide-react@0.487.0";
import { courses, recentSigns, weeklyGoals } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { CourseCard } from "../CourseCard";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

export function CourseDashboard() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Welcome back, {userName}</h1>
          <p className="mt-3 text-slate-600">Your next lesson is ready. Keep the streak going and let the AI practice coach do the spotting.</p>
        </div>

        <section className="bg-gradient-brand relative mb-8 overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-black/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 flex items-center gap-2 text-sm text-white/80">
                <BookOpen className="h-4 w-4" />
                Continue Learning
              </p>
              <h2 className="text-3xl font-semibold">ISL Alphabet Fundamentals</h2>
              <p className="mt-2 text-white/85">Lesson 5: Letter E. You are 46% through the course and your accuracy trend is climbing.</p>
              <div className="mt-5 max-w-xl">
                <div className="mb-2 flex justify-between text-sm text-white/80">
                  <span>Course Progress</span>
                  <span>46%</span>
                </div>
                <Progress value={46} className="h-2.5 bg-white/20" />
              </div>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => onNavigate("lesson:letter-e")}
            >
              Continue Lesson
            </Button>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10">
                <TrendingUp className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-xl">Progress Overview</h3>
            </div>
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">Overall Completion</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2.5 bg-slate-100" />
            </div>
            <div className="space-y-3 border-t border-slate-200 pt-4">
              {weeklyGoals.map((goal) => (
                <div key={goal.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-500">{goal.label}</span>
                    <span>{goal.current}/{goal.target}</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2 bg-slate-100" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl">Your Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["124", "Signs"],
                ["89%", "Accuracy"],
                ["18.5h", "Time"],
                ["3", "Courses"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-2xl font-semibold text-slate-900">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl">Learning Streak</h3>
            </div>
            <div className="rounded-[1.25rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-5 text-center">
              <p className="text-5xl font-semibold text-slate-900">12</p>
              <p className="mt-1 text-sm text-slate-500">Current day streak</p>
              <div className="mt-5 flex justify-center gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <div
                    key={day + index}
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs ${
                      index < 5 ? "bg-gradient-brand text-white" : "bg-white text-slate-400"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
              <span className="text-slate-500">Best streak</span>
              <span className="flex items-center gap-2 text-slate-800">
                <Award className="h-4 w-4 text-amber-500" />
                15 days
              </span>
            </div>
          </div>
        </section>

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
                progress={course.progress}
                lessonsCompleted={course.lessonsCompleted}
                totalLessons={course.totalLessons}
                onViewCourse={(id) => onNavigate(`course:${id}`)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">Recently Practiced Signs</h2>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("achievements")}>
              View All Progress
            </Button>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sign</TableHead>
                  <TableHead>Last Practiced</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSigns.map((item) => (
                  <TableRow key={item.sign}>
                    <TableCell className="font-medium text-slate-900">{item.sign}</TableCell>
                    <TableCell className="text-slate-500">{item.lastPracticed}</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.accuracy >= 90
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.accuracy}%
                      </span>
                    </TableCell>
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
