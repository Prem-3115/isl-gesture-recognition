import { useEffect } from "react";
import { useOutletContext } from "react-router";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { courses, featureTiles, featuredStats, howItWorks, testimonials } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { CourseCard } from "../CourseCard";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import heroIllustration from "@/assets/hero_illustration.png";

export function HomePage() {
  const { onNavigate, isLoggedIn, onOpenAuth } = useOutletContext<LayoutOutletContext>();

  useEffect(() => {
    document.title = "ISL Connect — Learn Indian Sign Language with AI";
  }, []);

  return (
    <div className="pb-6">
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 border border-slate-200">
              <Sparkles className="h-4 w-4" />
              Intelligent practice for modern ISL learners
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight text-slate-950 lg:text-6xl">
              Master ISL (Indian Sign Language) with{" "}
              <span className="text-primary">Intelligent Practice</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Learn through short ISL video lessons, webcam-based feedback, and guided practice flows that make consistent study feel approachable.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group/btn h-12 rounded-xl bg-primary px-8 text-primary-foreground shadow-sm transition-all hover:bg-primary/95 hover:shadow-md active:scale-[0.98]"
                onClick={() => (isLoggedIn ? onNavigate("lesson:letter-a") : onOpenAuth("signup"))}
              >
                <span className="font-semibold">Start Free Lesson</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-slate-200 bg-white px-8 text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
                onClick={() => onNavigate("dashboard")}
              >
                <span className="font-medium">Explore Courses</span>
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-4">
              {featuredStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-extrabold tracking-tight text-primary">{stat.value}</p>
                  <p className="mt-1 text-sm font-medium capitalize text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-2 shadow-elevation">
              <div className="rounded-2xl bg-slate-50">
                <ImageWithFallback
                  src={heroIllustration}
                  alt="ISL Connect interactive learning illustration"
                  className="h-[440px] w-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 z-10 w-72 rounded-[1.5rem] border border-slate-200 bg-white/90 p-5 shadow-elevation backdrop-blur-md">
              <p className="text-sm font-bold text-slate-900">Practice with live feedback</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Use the webcam flow, compare your hand shape with the ISL chart, and refine each sign step by step.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">How It Works</p>
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">A clear path from first sign to confident practice</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <div key={step.title} className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-slate-100 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className="text-4xl font-bold text-slate-200">0{index + 1}</span>
                </div>
                <h3 className="mb-3 text-lg font-bold text-slate-900">{step.title}</h3>
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
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Start with the most loved pathways</h2>
            </div>
            <Button variant="outline" className="rounded-xl shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]" onClick={() => onNavigate("dashboard")}>
              <span className="font-medium">View All Courses</span>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">Why ISL Connect</p>
            <h2 className="text-3xl font-bold text-slate-950">Built to make deliberate practice feel accessible</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featureTiles.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded bg-slate-100">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-3 text-base font-bold text-slate-900">{feature.title}</h3>
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
            <h2 className="text-3xl font-bold text-slate-950">Learners using ISL Connect in real life</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <div 
                key={item.name} 
                className="card-enter rounded-xl border border-slate-200 bg-white p-6 shadow-elevation transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevation-hover"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="mb-5 flex gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-slate-300 text-slate-300" />
                  ))}
                </div>
                <p className="min-h-28 text-sm leading-7 text-slate-700">"{item.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-sm font-bold text-slate-900">
                    {item.name.split(" ").map((part) => part[0]).join("")}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-950 px-8 py-16 text-primary-foreground shadow-elevation">
          <div className="absolute right-0 top-0 h-96 w-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/5 blur-3xl" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Start Today</p>
              <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Practice ISL with AI, learn with confidence, and build a steady routine.</h2>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-14 rounded-xl bg-white px-8 text-slate-950 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98]"
              onClick={() => (isLoggedIn ? onNavigate("dashboard") : onOpenAuth("signup"))}
            >
              <span className="font-semibold">{isLoggedIn ? "Go to Dashboard" : "Sign Up Free"}</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

