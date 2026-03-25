import { Facebook, Hand, Instagram, Twitter, Youtube } from "lucide-react@0.487.0";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/60 bg-white/90">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-brand flex h-10 w-10 items-center justify-center rounded-2xl text-white">
                <Hand className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gradient-brand text-lg font-semibold">ISL Connect</p>
                <p className="text-xs text-slate-500">Learn, practice, belong</p>
              </div>
            </div>
            <p className="max-w-xs text-sm text-slate-600">
              An AI-powered ISL (Indian Sign Language) learning platform designed to make daily practice feel approachable and joyful.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon) => (
                <button
                  key={Icon.displayName ?? Icon.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Learning</h3>
            <div className="grid gap-3 text-sm text-slate-600">
              <button onClick={() => onNavigate("dashboard")} className="text-left transition hover:text-primary">All Courses</button>
              <button onClick={() => onNavigate("practice")} className="text-left transition hover:text-primary">Practice Mode</button>
              <button onClick={() => onNavigate("achievements")} className="text-left transition hover:text-primary">Achievements</button>
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">Free Lesson</button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Support</h3>
            <div className="grid gap-3 text-sm text-slate-600">
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">Help Center</button>
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">Accessibility</button>
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">Contact Us</button>
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">FAQs</button>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Company</h3>
            <div className="grid gap-3 text-sm text-slate-600">
              <button onClick={() => onNavigate("about")} className="text-left transition hover:text-primary">About ISL Connect</button>
              <button onClick={() => onNavigate("community")} className="text-left transition hover:text-primary">Community</button>
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">Privacy</button>
              <button onClick={() => onNavigate("home")} className="text-left transition hover:text-primary">Terms</button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {year} ISL Connect. All rights reserved.</p>
          <p>Built with React, TypeScript, TailwindCSS v4, shadcn/ui, and mocked AI practice flows.</p>
        </div>
      </div>
    </footer>
  );
}
