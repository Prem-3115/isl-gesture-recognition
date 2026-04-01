import { useOutletContext } from "react-router";
import { Award, BookOpen, Flame, Trophy } from "lucide-react@0.487.0";
import { achievements, challengingSigns, recentActivity } from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const reflectionCards = [
  {
    label: "Learning Focus",
    value: "Consistent review",
    icon: BookOpen,
  },
  {
    label: "Practice Style",
    value: "Short, steady sessions",
    icon: Flame,
  },
  {
    label: "Current Goal",
    value: "Refine core signs",
    icon: Trophy,
  },
  {
    label: "Approach",
    value: "Guided repetition",
    icon: Award,
  },
] as const;

export function AchievementsPage() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="bg-gradient-brand relative mb-8 overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-black/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-white/20 text-5xl shadow-lg">
              {(userName?.[0] ?? "P").toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-semibold">{userName}</h1>
              <p className="mt-2 text-white/80">
                Use this page as a reflection space for your ISL learning journey, review habits, and next practice targets.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">Guided review</span>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">Practice notes</span>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">Suggested refreshers</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {reflectionCards.map((card) => (
            <div key={card.label} className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-gradient-brand text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-sm text-slate-500">{card.label}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">Learning Highlights</h2>
            <span className="text-sm text-slate-500">A qualitative view of your recent work</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item) => (
              <div key={item.name} className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-950">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.label} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <span className={`mt-2 h-2.5 w-2.5 rounded-full ${activity.tone}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-950">How To Use This Page</h2>
            <div className="space-y-4 text-sm leading-7 text-slate-600">
              <p>Review which signs felt clear during practice and which ones need slower repetition.</p>
              <p>Use the practice workspace to test signs again while comparing against the reference chart.</p>
              <p>Keep notes grounded in actual sessions rather than summary numbers, especially while the project is still in prototype mode.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Suggested Review Signs</h2>
              <p className="mt-1 text-slate-500">Signs worth revisiting in your next practice session</p>
            </div>
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
