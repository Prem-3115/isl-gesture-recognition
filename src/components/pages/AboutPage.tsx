import { useEffect } from "react";
import { useOutletContext } from "react-router";
import {
  BookOpen,
  BrainCircuit,
  Hand,
  Heart,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { LayoutOutletContext } from "@/types/layout";

const teamMembers = [
  { initials: "SS", name: "Shrey Shah", role: "Project Lead & ML Engineer" },
  { initials: "PM", name: "Project Member", role: "Frontend Developer" },
  { initials: "PM", name: "Project Member", role: "UI/UX & Backend" },
];

const values = [
  {
    icon: Heart,
    title: "Inclusion First",
    description:
      "ISL Connect exists to bridge the gap between the hearing and deaf communities by making sign language accessible to everyone.",
    accent: "from-rose-400 to-pink-500",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Learning",
    description:
      "We combine MediaPipe hand-tracking with a custom-trained ISL model to provide real-time gesture feedback that adapts to each learner.",
    accent: "from-primary to-secondary",
  },
  {
    icon: Target,
    title: "Deliberate Practice",
    description:
      "Short lessons, webcam feedback, and a structured curriculum are designed around evidence-based learning principles.",
    accent: "from-secondary to-accent",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Our community spaces connect learners, enable peer support, and create shared milestones that keep motivation high.",
    accent: "from-emerald-400 to-teal-500",
  },
];

export function AboutPage() {
  useEffect(() => {
    document.title = "About — ISL Connect";
  }, []);

  const { onNavigate } = useOutletContext<LayoutOutletContext>();

  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-20 lg:pt-16">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-primary/10 via-secondary/8 to-transparent" />
        <div className="absolute left-[-6rem] top-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-4rem] top-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/80 px-4 py-2 text-sm text-primary shadow-sm">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            About ISL Connect
          </div>
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl">
            Making Indian Sign Language{" "}
            <span className="text-gradient-brand">accessible to all</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            ISL Connect is a student-built, AI-powered learning platform that
            helps people learn and practice Indian Sign Language (ISL) through
            short lessons, real-time webcam gesture recognition, and an
            encouraging community.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/85 p-8 shadow-sm md:p-12">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Our Mission
                </p>
                <h2 className="text-3xl font-semibold text-slate-950">
                  Bridge communication gaps with technology
                </h2>
                <p className="mt-4 text-slate-600 leading-7">
                  Over 18 million people in India are deaf or hard of hearing.
                  ISL (Indian Sign Language) is their primary mode of
                  communication, yet resources for learning it are scarce,
                  expensive, or inaccessible. ISL Connect was built to change
                  that — combining modern AI with deliberate practice flows.
                </p>
                <p className="mt-4 text-slate-600 leading-7">
                  Built as a Design Engineering project, the platform features a
                  real gesture recognition pipeline using MediaPipe and a
                  custom-trained scikit-learn model on ISL alphabet data.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 content-start">
                {[
                  { icon: Hand, label: "35 ISL Signs", sub: "A–Z + 1–9 digits" },
                  { icon: BrainCircuit, label: "AI Recognition", sub: "MediaPipe + Flask" },
                  { icon: BookOpen, label: "Structured Lessons", sub: "Guided curriculum" },
                  { icon: Users, label: "Community", sub: "Peer learning" },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="rounded-[1.5rem] bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-5"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p className="font-semibold text-slate-950">{label}</p>
                    <p className="mt-1 text-sm text-slate-500">{sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              What We Stand For
            </p>
            <h2 className="text-3xl font-semibold text-slate-950">
              Our core values
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-[1.5rem] border border-white/70 bg-white/85 p-6 shadow-sm"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${v.accent} text-white`}
                >
                  <v.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-slate-950">
                  {v.title}
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              The Team
            </p>
            <h2 className="text-3xl font-semibold text-slate-950">
              Built by students, for everyone
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm text-center"
              >
                <div className="bg-gradient-brand mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.25rem] text-lg font-semibold text-white shadow-lg">
                  {member.initials}
                </div>
                <p className="font-semibold text-slate-950">{member.name}</p>
                <p className="mt-1 text-sm text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-gradient-brand relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] px-8 py-12 text-white shadow-2xl">
          <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                Start Learning
              </p>
              <h2 className="text-3xl font-semibold">
                Ready to start your ISL journey?
              </h2>
            </div>
            <Button
              size="lg"
              variant="secondary"
              className="h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90"
              onClick={() => onNavigate("dashboard")}
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
