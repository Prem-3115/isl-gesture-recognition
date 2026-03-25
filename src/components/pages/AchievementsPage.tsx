import { useOutletContext } from "react-router";
import { Award, Calendar, Flame, Trophy } from "lucide-react@0.487.0";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts@2.15.2";
import {
  achievements,
  accuracyTrend,
  categoryProgress,
  challengingSigns,
  masteryDistribution,
  recentActivity,
} from "@/data/mockData";
import { LayoutOutletContext } from "@/types/layout";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

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
              👤
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-semibold">{userName} Sharma</h1>
              <p className="mt-2 text-white/80">Level 3 learner building everyday ISL confidence through guided practice.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">12-day streak</span>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">4 badges earned</span>
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm">Member since Sep 2025</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total Signs", value: "124", icon: Award },
            { label: "Practice Time", value: "18.5h", icon: Calendar },
            { label: "Best Streak", value: "12 days", icon: Flame },
            { label: "Avg Accuracy", value: "89%", icon: Trophy },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-gradient-brand text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">Achievements</h2>
            <span className="text-sm text-slate-500">{achievements.filter((item) => item.earned).length} of {achievements.length} unlocked</span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {achievements.map((item) => (
              <div
                key={item.name}
                className={`rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm ${item.earned ? "" : "opacity-60 grayscale-[0.25]"}`}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">{item.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                {item.earned ? (
                  <p className="mt-4 text-sm text-primary">Earned on {item.date}</p>
                ) : (
                  <div className="mt-4">
                    <Progress value={item.progress ?? 0} className="h-2 bg-slate-100" />
                    <p className="mt-2 text-sm text-slate-500">{item.progress}% complete</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-950">Accuracy Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrend}>
                <defs>
                  <linearGradient id="accuracyStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="55%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#64748B" />
                <YAxis domain={[70, 95]} stroke="#64748B" />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #E2E8F0" }} />
                <Line type="monotone" dataKey="accuracy" stroke="url(#accuracyStroke)" strokeWidth={3} dot={{ fill: "#8B5CF6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-950">Signs by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryProgress}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="55%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="category" stroke="#64748B" angle={-18} height={56} textAnchor="end" />
                <YAxis stroke="#64748B" />
                <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid #E2E8F0" }} />
                <Bar dataKey="signs" fill="url(#barFill)" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-950">Mastery Distribution</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={masteryDistribution} dataKey="value" innerRadius={70} outerRadius={102} paddingAngle={3}>
                  {masteryDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

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
        </section>

        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Challenging Signs</h2>
              <p className="mt-1 text-slate-500">Signs worth revisiting in your next practice session</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sign</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challengingSigns.map((item) => (
                  <TableRow key={item.sign}>
                    <TableCell className="font-medium">{item.sign}</TableCell>
                    <TableCell>{item.accuracy}%</TableCell>
                    <TableCell>{item.attempts}</TableCell>
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
