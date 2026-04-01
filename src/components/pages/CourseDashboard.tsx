import { useOutletContext } from "react-router";
import { BookOpen, Flame, Target } from "lucide-react@0.487.0";
import { courses, recentSigns } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { CourseCard } from "../CourseCard";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const dashboardFocus = [
  {
    title: "Continue Learning",
    description: "Pick up where you left off in the alphabet lessons and move into the next guided sign.",
    icon: BookOpen,
  },
  {
    title: "Practice Routine",
    description: "Use short webcam practice sessions to reinforce hand shape, motion, and orientation.",
    icon: Target,
  },
  {
    title: "Stay Consistent",
    description: "A small daily routine is enough to keep the material fresh and easier to recall.",
    icon: Flame,
  },
] as const;

export function CourseDashboard() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Welcome back, {userName}</h1>
          <p className="mt-3 text-slate-600">Your next lesson is ready, and the practice tools are set up when you want to review signs.</p>
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
              <h2 className="text-3xl font-semibold">Learn ISL Alphabet</h2>
              <p className="mt-2 text-white/85">
                Re-enter the course, review recent material, and move into the next lesson when you are ready.
              </p>
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
          {dashboardFocus.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </div>
          ))}
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
                difficulty={course.difficulty}
                onViewCourse={(id) => onNavigate(`course:${id}`)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">Recently Practiced Signs</h2>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("practice")}>
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
                    <TableCell className="font-medium text-slate-900">{item.sign}</TableCell>
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
