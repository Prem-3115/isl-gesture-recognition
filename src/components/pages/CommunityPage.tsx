import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Award,
  Calendar,
  Flame,
  Heart,
  MessageSquare,
  PenLine,
  RotateCcw,
  Send,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";
import {
  communityEvents,
  communityStats,
  discussions,
  leaderboard,
  signOfTheDay,
  studyGroups,
} from "@/data/mockData";
import type { LayoutOutletContext } from "@/types/layout";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

// ─── Tag badge ──────────────────────────────────────────────────────────────
const TAG_STYLES: Record<string, string> = {
  Alphabet: "bg-primary/10 text-primary",
  Practice: "bg-secondary/10 text-secondary",
  Milestone: "bg-emerald-100 text-emerald-700",
  Resources: "bg-amber-100 text-amber-700",
  Beginner: "bg-primary/10 text-primary",
  Active: "bg-emerald-100 text-emerald-700",
  Professional: "bg-secondary/10 text-secondary",
  Competitive: "bg-amber-100 text-amber-700",
  "Live Challenge": "bg-red-100 text-red-700",
  Webinar: "bg-primary/10 text-primary",
  "Weekly Event": "bg-secondary/10 text-secondary",
  Recurring: "bg-slate-100 text-slate-600",
};

function Tag({ label }: { label: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${TAG_STYLES[label] ?? "bg-slate-100 text-slate-600"}`}
    >
      {label}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
// Bug fix: sm used rounded-2xl (12px radius) on a 32px element — disproportionate.
// Fixed: sm → rounded-xl, md/lg → rounded-2xl.
function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg"
      ? "h-14 w-14 rounded-2xl text-base"
      : size === "sm"
        ? "h-8 w-8 rounded-xl text-xs"
        : "h-11 w-11 rounded-2xl text-sm";
  return (
    <div
      className={`bg-gradient-brand flex shrink-0 items-center justify-center font-semibold text-white shadow-sm ${cls}`}
    >
      {initials}
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface LocalPost {
  id: string;
  author: string;
  initials: string;
  time: string;
  topic: string;
  body: string;
  replies: number;
  likes: number;
  tag: string;
  isLocal: true;
}

// ─── Main component ──────────────────────────────────────────────────────────
export function CommunityPage() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();

  // Group join state
  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  // Post like state
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  // Reply expand state — which post id is showing the reply box
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  // New thread compose state
  const [showCompose, setShowCompose] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTag, setNewTag] = useState("Practice");
  // Locally posted threads
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);
  // Event remind-me state
  const [remindedEvents, setRemindedEvents] = useState<Set<string>>(new Set());

  const toggleJoin = (id: string) =>
    setJoinedGroups((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleLike = (id: string) =>
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleRemind = (eventId: string, eventTitle: string) => {
    if (remindedEvents.has(eventId)) return;
    setRemindedEvents((prev) => new Set(prev).add(eventId));
    toast.success(`Reminder set for "${eventTitle}"`, {
      description: "We'll notify you before the event starts.",
    });
  };

  const handleReply = (postId: string) => {
    if (!replyText.trim()) return;
    toast.success("Reply posted!", { description: "Your reply is now visible to the community." });
    setReplyText("");
    setReplyingTo(null);
  };

  const handleNewPost = () => {
    if (!newTopic.trim() || !newBody.trim()) {
      toast.error("Please fill in both the topic and the message.");
      return;
    }
    const initials = userName
      .split(" ")
      .map((p: string) => p[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "ME";

    const post: LocalPost = {
      id: `local-${Date.now()}`,
      author: userName,
      initials,
      time: "Just now",
      topic: newTopic.trim(),
      body: newBody.trim(),
      replies: 0,
      likes: 0,
      tag: newTag,
      isLocal: true,
    };
    setLocalPosts((prev) => [post, ...prev]);
    setNewTopic("");
    setNewBody("");
    setNewTag("Practice");
    setShowCompose(false);
    toast.success("Thread posted!", { description: "Your discussion is now live." });
  };

  const allPosts = [...localPosts, ...discussions];

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Community</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">
            Learn together, grow together
          </h1>
          <p className="mt-3 text-slate-600">
            Join 50,000+ ISL learners, share your progress, climb the leaderboard, and practice
            with a sign every day.
          </p>
        </div>

        {/* ── Hero banner ─────────────────────────────────────── */}
        <section className="bg-gradient-brand relative mb-8 overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-44 w-44 rounded-full bg-black/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm text-white/80">
                <Users className="h-4 w-4" />
                ISL Connect Community
              </p>
              <h2 className="text-3xl font-semibold">A space built for ISL learners</h2>
              <p className="mt-2 max-w-2xl text-white/80">
                Ask questions, share milestones, join study groups, and compete on the
                accuracy leaderboard — all in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {communityStats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur">
                  <p className="text-2xl font-semibold">{s.value}</p>
                  <p className="mt-1 text-xs text-white/75">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sign of the Day + Events ─────────────────────────── */}
        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">

          {/* Sign of the Day */}
          <div className="rounded-[1.75rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 shadow-lg shadow-primary/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Sign of the Day
                </p>
                <p className="text-sm text-slate-500">Voted by the community · {signOfTheDay.category}</p>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6">
              <p className="text-5xl font-semibold text-slate-950">{signOfTheDay.sign}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{signOfTheDay.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {signOfTheDay.practiceCount.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Practised today</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {signOfTheDay.topAccuracy}%
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Top accuracy</p>
                </div>
              </div>
              <Button
                className="bg-gradient-brand mt-5 w-full rounded-xl border-0 text-white hover:opacity-90"
                onClick={() => onNavigate("practice")}
              >
                Practise This Sign
              </Button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-[1.5rem] border border-white/70 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-slate-950">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
              {communityEvents.map((event) => {
                const isRecurring = event.type === "Recurring";
                const reminded = remindedEvents.has(event.id);
                return (
                  <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{event.title}</p>
                      <Tag label={event.type} />
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500">
                      {isRecurring ? <RotateCcw className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5" />}
                      {event.date} · {event.time}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      {/* Fix: future events show "interested", not "attending" */}
                      {!isRecurring && event.interested > 0 ? (
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Users className="h-3.5 w-3.5" />
                          {event.interested} interested
                        </span>
                      ) : (
                        <span />
                      )}
                      {!isRecurring && (
                        <Button
                          size="sm"
                          variant={reminded ? "outline" : "outline"}
                          className={`h-7 rounded-lg px-3 text-xs ${reminded ? "border-emerald-300 text-emerald-700" : ""}`}
                          onClick={() => handleRemind(event.id, event.title)}
                          disabled={reminded}
                        >
                          {reminded ? "Reminded ✓" : "Remind Me"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Leaderboard ──────────────────────────────────────── */}
        {/* Fix: renamed from "Weekly Leaderboard" — metric is all-time signsLearned, not weekly */}
        <section className="mb-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Rankings</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">All-time Leaderboard</h2>
              <p className="mt-1 text-sm text-slate-500">Ranked by total signs learned · resets every Sunday</p>
            </div>
            <Button variant="outline" className="rounded-xl" onClick={() => onNavigate("achievements")}>
              My Stats
            </Button>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Rank</TableHead>
                  <TableHead>Learner</TableHead>
                  <TableHead className="hidden sm:table-cell">City</TableHead>
                  <TableHead>Signs Learned</TableHead>
                  <TableHead className="hidden md:table-cell">Streak</TableHead>
                  <TableHead className="text-right">Accuracy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((member) => {
                  const initials = member.name.split(" ").map((p) => p[0]).join("");
                  const medalColors: Record<number, string> = {
                    1: "text-amber-500",
                    2: "text-slate-400",
                    3: "text-amber-700",
                  };
                  return (
                    <TableRow key={member.rank}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {member.rank <= 3 ? (
                            <Trophy className={`h-5 w-5 ${medalColors[member.rank]}`} />
                          ) : (
                            <span className="text-sm text-slate-400">#{member.rank}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {/* Avatar fix: sm size now uses rounded-xl (proportional to 32px) */}
                          <Avatar initials={initials} size="sm" />
                          <span className="font-medium text-slate-900">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden text-slate-500 sm:table-cell">{member.city}</TableCell>
                      <TableCell>
                        <span className="font-medium text-slate-900">{member.signsLearned}</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="flex items-center gap-1.5 text-sm">
                          <Flame className="h-4 w-4 text-orange-500" />
                          {member.streak}d
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            member.accuracy >= 95
                              ? "bg-emerald-100 text-emerald-700"
                              : member.accuracy >= 90
                                ? "bg-primary/10 text-primary"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {member.accuracy}%
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* ── Study Groups + Discussion ────────────────────────── */}
        <section className="mb-8 grid gap-6 xl:grid-cols-[1fr_1.1fr]">

          {/* Study Groups */}
          <div>
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Groups</p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-950">Study Groups</h2>
            </div>
            <div className="space-y-4">
              {studyGroups.map((group) => (
                <div key={group.id} className="rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${group.accent} text-white shadow-sm`}>
                      <group.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-950">{group.name}</h3>
                        <Tag label={group.tag} />
                      </div>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{group.description}</p>
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Users className="h-3.5 w-3.5" />
                          {joinedGroups.has(group.id) ? group.members + 1 : group.members} members
                        </span>
                        <Button
                          size="sm"
                          variant={joinedGroups.has(group.id) ? "outline" : "default"}
                          className="h-8 rounded-lg px-4 text-xs"
                          onClick={() => toggleJoin(group.id)}
                        >
                          {joinedGroups.has(group.id) ? "Joined ✓" : "Join Group"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Board */}
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Discuss</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Discussion Board</h2>
              </div>
              <Button
                size="sm"
                className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90"
                onClick={() => setShowCompose((v) => !v)}
              >
                <PenLine className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            </div>

            {/* Compose new thread */}
            {showCompose && (
              <div className="mb-4 rounded-[1.5rem] border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-slate-950">Start a Discussion</p>
                  <button onClick={() => setShowCompose(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Topic / question title"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <textarea
                  placeholder="Share your question, tip, or experience..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  rows={3}
                  className="mb-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <div className="flex items-center justify-between gap-3">
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-primary/50"
                  >
                    <option>Practice</option>
                    <option>Alphabet</option>
                    <option>Resources</option>
                    <option>Milestone</option>
                  </select>
                  <Button size="sm" className="rounded-xl" onClick={handleNewPost}>
                    <Send className="mr-2 h-3.5 w-3.5" />
                    Post Thread
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {allPosts.map((post) => {
                const postId = post.id;
                const isReplying = replyingTo === postId;
                return (
                  <div key={postId} className="rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Avatar initials={post.initials} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">{post.author}</p>
                          <div className="flex items-center gap-2">
                            <Tag label={post.tag} />
                            <span className="text-xs text-slate-400">{post.time}</span>
                          </div>
                        </div>
                        <p className="mt-2 font-semibold text-slate-950">{post.topic}</p>
                        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-600">
                          {post.body}
                        </p>
                        <div className="mt-3 flex items-center gap-4">
                          <button
                            onClick={() => toggleLike(postId)}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              likedPosts.has(postId) ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${likedPosts.has(postId) ? "fill-rose-500" : ""}`} />
                            {post.likes + (likedPosts.has(postId) ? 1 : 0)}
                          </button>
                          <button
                            onClick={() => setReplyingTo(isReplying ? null : postId)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-primary"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {post.replies} {post.replies === 1 ? "reply" : "replies"}
                          </button>
                        </div>
                        {/* Reply input — expands when clicking Replies */}
                        {isReplying && (
                          <div className="mt-3 flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              placeholder="Write a reply…"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleReply(postId)}
                              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                            />
                            <Button
                              size="sm"
                              className="h-8 rounded-xl px-3"
                              onClick={() => handleReply(postId)}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Member Spotlight ─────────────────────────────────── */}
        <section className="mb-8">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Spotlight</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">Learners of the Month</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {leaderboard.slice(0, 3).map((member, idx) => {
              const initials = member.name.split(" ").map((p) => p[0]).join("");
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div key={member.rank} className="rounded-[1.75rem] border border-white/70 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar initials={initials} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-950">{member.name}</p>
                        <span>{medals[idx]}</span>
                      </div>
                      <p className="text-sm text-slate-500">{member.city}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-slate-500">
                        <span>Accuracy</span>
                        <span>{member.accuracy}%</span>
                      </div>
                      <Progress value={member.accuracy} className="h-2 bg-slate-100" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-lg font-semibold text-slate-900">{member.signsLearned}</p>
                        <p className="text-xs text-slate-500">Signs</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-center">
                        <p className="text-lg font-semibold text-slate-900">{member.streak}d</p>
                        <p className="text-xs text-slate-500">Streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CTA banner ──────────────────────────────────────── */}
        <section>
          <div className="bg-gradient-brand relative overflow-hidden rounded-[2rem] px-8 py-12 text-white shadow-2xl">
            <div className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-black/10 blur-2xl" />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  <Award className="h-4 w-4" />
                  Keep Learning
                </p>
                <h2 className="text-3xl font-semibold">Ready to climb the leaderboard?</h2>
                <p className="mt-2 text-white/80">
                  Open a practice session, hit a new accuracy record, and see your rank update
                  on the community board.
                </p>
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 rounded-xl bg-white text-slate-900 hover:bg-white/90"
                onClick={() => onNavigate("practice")}
              >
                Start Practising
              </Button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
