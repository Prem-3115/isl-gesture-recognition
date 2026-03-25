import { useOutletContext } from "react-router";
import { ArrowRight, CheckCircle2, Sparkles, Star } from "lucide-react@0.487.0";
import { courses, featureTiles, featuredStats, howItWorks, testimonials } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { CourseCard } from "../CourseCard";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";

export function HomePage() {
  const { onNavigate, isLoggedIn, onOpenAuth } = useOutletContext<LayoutOutletContext>();

  return (
    <div className="pb-6">
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-primary/10 via-secondary/8 to-transparent" />
        <div className="absolute left-[-6rem] top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm text-primary shadow-sm">
              <Sparkles className="h-4 w-4" />
              Intelligent practice for modern ISL learners
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
              Master Indian Sign Language with{" "}
              <span className="text-gradient-brand">Intelligent Practice</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Learn through short video lessons, webcam-based feedback, and progress dashboards that make consistent ISL practice feel rewarding.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-gradient-brand h-12 rounded-xl border-0 px-6 text-white hover:opacity-90"
                onClick={() => (isLoggedIn ? onNavigate("lesson:letter-a") : onOpenAuth("signup"))}
              >
                Start Free Lesson
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-slate-200 bg-white/80 px-6"
                onClick={() => onNavigate("dashboard")}
              >
                Explore Courses
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-[1.5rem] border border-white/60 bg-white/80 p-5 shadow-sm sm:grid-cols-4">
              {featuredStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-gradient-brand text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-1 text-sm capitalize text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="panel-glow overflow-hidden rounded-[2rem] border border-white/60 bg-white p-3">
              <div className="overflow-hidden rounded-[1.5rem]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                  alt="Learners practicing together"
                  className="h-[440px] w-full object-cover"
                />
              </div>
            </div>
            <div className="panel-glow absolute -bottom-6 left-4 w-56 rounded-3xl border border-white/70 bg-white/95 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary/15 to-accent/15">
                  <CheckCircle2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Live Accuracy</p>
                  <p className="text-xs text-slate-500">Average AI feedback score</p>
                </div>
              </div>
              <p className="text-gradient-brand text-3xl font-semibold">92%</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">How It Works</p>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl">A clear path from first sign to confident practice</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-white/70 bg-white/85 p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white`}>
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="text-5xl font-semibold text-slate-100">0{index + 1}</span>
                </div>
                <h3 className="mb-3 text-xl">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Popular Courses</p>
              <h2 className="text-3xl font-semibold text-slate-950">Start with the most loved pathways</h2>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("dashboard")}>
              View All Courses
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why ISL Connect</p>
            <h2 className="text-3xl font-semibold text-slate-950">Built to make deliberate practice feel accessible</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureTiles.map((feature) => (
              <div key={feature.title} className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-3 text-lg">{feature.title}</h3>
                <p className="text-sm leading-7 text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Testimonials</p>
            <h2 className="text-3xl font-semibold text-slate-950">Learners using ISL Connect in real life</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-sm">
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="min-h-28 text-sm leading-7 text-slate-600">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="bg-gradient-brand flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold text-white">
                    {item.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-gradient-brand relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-8 py-12 text-white shadow-2xl">
          <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Start Today</p>
              <h2 className="text-3xl font-semibold">Practice with AI, learn with confidence, and track real progress.</h2>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => (isLoggedIn ? onNavigate("dashboard") : onOpenAuth("signup"))}
            >
              {isLoggedIn ? "Go to Dashboard" : "Sign Up Free"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
