import { useState } from "react";
import { useOutletContext } from "react-router";
import {
  Award,
  Calendar,
  Heart,
  MessageSquare,
  PenLine,
  RotateCcw,
  Send,
  Users,
  X,
  Zap,
} from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";
import {
  communityEvents,
  discussions,
  signOfTheDay,
  studyGroups,
} from "@/data/mockData";
import type { LayoutOutletContext } from "@/types/layout";
import { Button } from "../ui/button";

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
  Recurring: "bg-slate-100 text-slate-600",
};

function Tag({ label }: { label: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${TAG_STYLES[label] ?? "bg-slate-100 text-slate-600"}`}>
      {label}
    </span>
  );
}

function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "lg"
      ? "h-14 w-14 rounded-2xl text-base"
      : size === "sm"
        ? "h-8 w-8 rounded-xl text-xs"
        : "h-11 w-11 rounded-2xl text-sm";

  return (
    <div className={`bg-gradient-brand flex shrink-0 items-center justify-center font-semibold text-white shadow-sm ${cls}`}>
      {initials}
    </div>
  );
}

interface LocalPost {
  id: string;
  author: string;
  initials: string;
  time: string;
  topic: string;
  body: string;
  tag: string;
  isLocal: true;
}

export function CommunityPage() {
  const { onNavigate, userName } = useOutletContext<LayoutOutletContext>();

  const [joinedGroups, setJoinedGroups] = useState<Set<string>>(new Set());
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [newTopic, setNewTopic] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newTag, setNewTag] = useState("Practice");
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);
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

  const handleReply = () => {
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
      .map((part: string) => part[0] ?? "")
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
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Community</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Learn together, grow together</h1>
          <p className="mt-3 text-slate-600">
            Ask questions, share practice notes, join study groups, and stay connected with other ISL learners.
          </p>
        </div>

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
                Ask questions, share milestones, join study groups, and exchange practical learning tips in one place.
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-5 py-4 text-sm text-white/85 backdrop-blur">
              Community features on this prototype are presented as discussion spaces rather than measured rankings.
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[1.75rem] border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-6 shadow-lg shadow-primary/10">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-md">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Sign of the Day</p>
                <p className="text-sm text-slate-500">{signOfTheDay.category}</p>
              </div>
            </div>
            <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6">
              <p className="text-5xl font-semibold text-slate-950">{signOfTheDay.sign}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{signOfTheDay.description}</p>
              <Button
                className="bg-gradient-brand mt-5 w-full rounded-xl border-0 text-white hover:opacity-90"
                onClick={() => onNavigate("practice")}
              >
                Practise This Sign
              </Button>
            </div>
          </div>

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
                    {!isRecurring && (
                      <div className="mt-3 flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className={`h-7 rounded-lg px-3 text-xs ${reminded ? "border-emerald-300 text-emerald-700" : ""}`}
                          onClick={() => handleRemind(event.id, event.title)}
                          disabled={reminded}
                        >
                          {reminded ? "Reminded" : "Remind Me"}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
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
                        <span className="text-xs text-slate-500">
                          Join to follow along with this discussion space.
                        </span>
                        <Button
                          size="sm"
                          variant={joinedGroups.has(group.id) ? "outline" : "default"}
                          className="h-8 rounded-lg px-4 text-xs"
                          onClick={() => toggleJoin(group.id)}
                        >
                          {joinedGroups.has(group.id) ? "Joined" : "Join Group"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Discuss</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">Discussion Board</h2>
              </div>
              <Button
                size="sm"
                className="bg-gradient-brand rounded-xl border-0 text-white hover:opacity-90"
                onClick={() => setShowCompose((value) => !value)}
              >
                <PenLine className="mr-2 h-4 w-4" />
                New Thread
              </Button>
            </div>

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
                  onChange={(event) => setNewTopic(event.target.value)}
                  className="mb-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <textarea
                  placeholder="Share your question, tip, or experience..."
                  value={newBody}
                  onChange={(event) => setNewBody(event.target.value)}
                  rows={3}
                  className="mb-3 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
                <div className="flex items-center justify-between gap-3">
                  <select
                    value={newTag}
                    onChange={(event) => setNewTag(event.target.value)}
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
                const isReplying = replyingTo === post.id;

                return (
                  <div key={post.id} className="rounded-[1.5rem] border border-white/70 bg-white p-5 shadow-sm">
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
                        <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-slate-600">{post.body}</p>
                        <div className="mt-3 flex items-center gap-4">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              likedPosts.has(post.id) ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${likedPosts.has(post.id) ? "fill-rose-500" : ""}`} />
                            Appreciate
                          </button>
                          <button
                            onClick={() => setReplyingTo(isReplying ? null : post.id)}
                            className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-primary"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Reply
                          </button>
                        </div>
                        {isReplying && (
                          <div className="mt-3 flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(event) => setReplyText(event.target.value)}
                              onKeyDown={(event) => event.key === "Enter" && handleReply()}
                              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                            />
                            <Button size="sm" className="h-8 rounded-xl px-3" onClick={handleReply}>
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
                <h2 className="text-3xl font-semibold">Ready for another practice session?</h2>
                <p className="mt-2 text-white/80">
                  Open the practice workspace, revisit the sign of the day, and bring what you learn back into the community.
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
