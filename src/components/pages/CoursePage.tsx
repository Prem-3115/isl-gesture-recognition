import { useMemo } from "react";
import { useOutletContext, useParams } from "react-router";
import { ArrowRight, CheckCircle2, Circle, Clock3, Download, PlayCircle } from "lucide-react@0.487.0";
import { courses, downloadableResources, lessonList } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";

export function CoursePage() {
  const { courseId = "alphabet" } = useParams();
  const { onNavigate } = useOutletContext<LayoutOutletContext>();

  const course = useMemo(
    () => courses.find((item) => item.id === courseId) ?? courses[0],
    [courseId],
  );

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-sm md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-secondary/6 to-accent/6" />
          <div className="relative grid gap-8 lg:grid-cols-[320px_1fr]">
            <div className="overflow-hidden rounded-[1.5rem]">
              <ImageWithFallback src={course.image} alt={course.title} className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                <PlayCircle className="h-3.5 w-3.5" />
                Guided learning path
              </div>
              <h1 className="text-4xl font-semibold text-slate-950">{course.title}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{course.description}</p>
              <p className="mt-3 text-sm text-slate-500">Refer to the ISL chart for accurate gestures.</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: Clock3, label: "Lesson Format", value: "Short guided sessions" },
                  { icon: PlayCircle, label: "Practice Style", value: "Step-by-step repetition" },
                  { icon: Circle, label: "Difficulty", value: course.difficulty },
                  { icon: ArrowRight, label: "Focus", value: "Build confidence gradually" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                    <item.icon className="mb-3 h-5 w-5 text-primary" />
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                    <p className="mt-1 font-medium text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90" size="lg" onClick={() => onNavigate("lesson:letter-d")}>
                  Open Course
                </Button>
                <Button className="rounded-xl" size="lg" variant="outline" onClick={() => onNavigate("practice")}>
                  Quick Practice
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold text-slate-950">Course Curriculum</h2>
          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm">
            {lessonList.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => onNavigate(`lesson:${lesson.id}`)}
                className="group flex w-full items-center gap-4 border-b border-slate-100 px-5 py-4 text-left last:border-b-0 hover:bg-slate-50/80"
              >
                <div className="flex-shrink-0">
                  {lesson.status === "done" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : lesson.status === "in-progress" ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary">
                      <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
                    </div>
                  ) : (
                    <Circle className="h-6 w-6 text-slate-300" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-sm text-slate-500">Lesson {index + 1}</span>
                    {lesson.status === "in-progress" && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">In Progress</span>
                    )}
                  </div>
                  <p className={`text-base ${lesson.status === "todo" ? "text-slate-500" : "text-slate-900"}`}>{lesson.title}</p>
                </div>
                <div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex">
                  <Clock3 className="h-4 w-4" />
                  {lesson.duration}
                </div>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-semibold text-slate-950">Course Resources</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {downloadableResources.map((resource) => (
              <button
                key={resource.title}
                className="flex items-center justify-between rounded-[1.25rem] border border-white/70 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div>
                  <p className="font-medium text-slate-900">{resource.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{resource.format} · {resource.size}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Download className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
