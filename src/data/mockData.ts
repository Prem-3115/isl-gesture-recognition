import {
  Award,
  BookOpen,
  Brain,
  Camera,
  Flame,
  Hand,
  Sparkles,
  Star,
  Target,
  Trophy,
  Video,
} from "lucide-react@0.487.0";

export const courses = [
  {
    id: "alphabet",
    title: "ISL Alphabet Fundamentals",
    description:
      "Build a strong signing foundation with guided lessons for every core alphabet handshape.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Beginner",
    progress: 46,
    lessonsCompleted: 4,
    totalLessons: 10,
    duration: "2.5 hours",
    enrolled: "12,450+",
    rating: "4.8/5",
  },
  {
    id: "greetings",
    title: "Everyday Greetings",
    description:
      "Practice hello, thank you, introductions, and social phrases used in daily conversation.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Beginner",
    progress: 74,
    lessonsCompleted: 6,
    totalLessons: 8,
    duration: "1.8 hours",
    enrolled: "9,860+",
    rating: "4.9/5",
  },
  {
    id: "numbers",
    title: "Numbers 1-100",
    description:
      "Learn number signs with short drills, memory checks, and quick real-world practice prompts.",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80",
    difficulty: "Beginner",
    progress: 20,
    lessonsCompleted: 2,
    totalLessons: 10,
    duration: "2.1 hours",
    enrolled: "8,420+",
    rating: "4.7/5",
  },
] as const;

export const featuredStats = [
  { value: "50K+", label: "learners" },
  { value: "500+", label: "signs" },
  { value: "95%", label: "satisfaction" },
  { value: "24/7", label: "AI support" },
] as const;

export const howItWorks = [
  {
    title: "Watch & Learn",
    description:
      "Follow short expert-led lessons that break each sign into shape, motion, and orientation.",
    icon: Video,
    accent: "from-primary to-secondary",
  },
  {
    title: "Practice with AI",
    description:
      "Use your camera or demo mode to get instant recognition feedback and confidence scores.",
    icon: Camera,
    accent: "from-secondary to-accent",
  },
  {
    title: "Track & Master",
    description:
      "See weekly improvements, revisit difficult signs, and celebrate streaks and milestones.",
    icon: Target,
    accent: "from-accent to-primary",
  },
] as const;

export const featureTiles = [
  {
    title: "Authentic Content",
    description:
      "Lessons are structured around practical Indian Sign Language usage and community-first learning.",
    icon: Hand,
  },
  {
    title: "AI Recognition",
    description:
      "Real-time simulated feedback helps learners understand positioning, confidence, and timing.",
    icon: Brain,
  },
  {
    title: "Expert Instructors",
    description:
      "Each module is framed like a guided classroom session with focused repetition and cues.",
    icon: Sparkles,
  },
  {
    title: "Flexible Schedule",
    description:
      "Five-minute drills, full lessons, and progress dashboards let you learn at your own pace.",
    icon: BookOpen,
  },
] as const;

export const testimonials = [
  {
    name: "Ananya Mehta",
    role: "Student, Delhi",
    quote:
      "The practice flow feels encouraging instead of intimidating. I finally stuck with learning ISL every week.",
  },
  {
    name: "Rahul Kapoor",
    role: "Teacher, Mumbai",
    quote:
      "My students loved how clear the step-by-step lesson cards are. The progress dashboard keeps them motivated.",
  },
  {
    name: "Sneha Patel",
    role: "Healthcare Worker, Ahmedabad",
    quote:
      "The sign references and quick AI tips helped me build confidence using essential phrases at work.",
  },
] as const;

export const weeklyGoals = [
  { label: "Practice Sessions", current: 4, target: 5 },
  { label: "New Signs", current: 8, target: 10 },
  { label: "Accuracy Goal", current: 89, target: 90 },
] as const;

export const recentSigns = [
  { sign: "Letter A", accuracy: 92, lastPracticed: "2 min ago" },
  { sign: "Letter B", accuracy: 87, lastPracticed: "18 min ago" },
  { sign: "Thank You", accuracy: 95, lastPracticed: "1 hour ago" },
  { sign: "Number 5", accuracy: 84, lastPracticed: "3 hours ago" },
] as const;

export const lessonList = [
  { id: "intro-isl", title: "Introduction to ISL", duration: "8 min", status: "done" },
  { id: "letter-a", title: "Letter A", duration: "6 min", status: "done" },
  { id: "letter-b", title: "Letter B", duration: "6 min", status: "done" },
  { id: "letter-c", title: "Letter C", duration: "6 min", status: "done" },
  { id: "letter-d", title: "Letter D", duration: "7 min", status: "in-progress" },
  { id: "letter-e", title: "Letter E", duration: "6 min", status: "todo" },
  { id: "letter-f", title: "Letter F", duration: "6 min", status: "todo" },
  { id: "letter-g", title: "Letter G", duration: "7 min", status: "todo" },
  { id: "review-a-g", title: "Review: Letters A-G", duration: "10 min", status: "todo" },
  { id: "alphabet-checkpoint", title: "Checkpoint Practice", duration: "15 min", status: "todo" },
] as const;

export const downloadableResources = [
  { title: "ISL Alphabet Chart", format: "PDF", size: "2.4 MB" },
  { title: "Beginner Practice Workbook", format: "PDF", size: "5.1 MB" },
  { title: "Common Mistakes Checklist", format: "PDF", size: "1.8 MB" },
] as const;

export const accuracyTrend = [
  { day: "Mon", accuracy: 75 },
  { day: "Tue", accuracy: 79 },
  { day: "Wed", accuracy: 82 },
  { day: "Thu", accuracy: 84 },
  { day: "Fri", accuracy: 86 },
  { day: "Sat", accuracy: 90 },
  { day: "Sun", accuracy: 89 },
] as const;

export const categoryProgress = [
  { category: "Alphabet", signs: 26 },
  { category: "Greetings", signs: 18 },
  { category: "Numbers", signs: 35 },
  { category: "Family", signs: 12 },
  { category: "Common Words", signs: 33 },
] as const;

export const masteryDistribution = [
  { name: "Mastered", value: 42, color: "#8B5CF6" },
  { name: "Strong", value: 28, color: "#EC4899" },
  { name: "Developing", value: 20, color: "#06B6D4" },
  { name: "Needs Practice", value: 10, color: "#CBD5E1" },
] as const;

export const achievements = [
  {
    name: "Alphabet Apprentice",
    description: "Completed the full alphabet pathway with 80%+ average accuracy.",
    icon: Award,
    earned: true,
    date: "Oct 1, 2025",
  },
  {
    name: "Greeting Guru",
    description: "Mastered 15 essential greeting signs for daily conversation.",
    icon: Trophy,
    earned: true,
    date: "Oct 7, 2025",
  },
  {
    name: "Streak Starter",
    description: "Practiced for 5 consecutive days and built a reliable habit.",
    icon: Flame,
    earned: true,
    date: "Oct 11, 2025",
  },
  {
    name: "Quick Study",
    description: "Finished 10 lessons in under two weeks with strong retention.",
    icon: Sparkles,
    earned: true,
    date: "Oct 18, 2025",
  },
  {
    name: "Perfect Practice",
    description: "Reach 100% accuracy on 10 different signs.",
    icon: Target,
    earned: false,
    progress: 60,
  },
  {
    name: "Century Club",
    description: "Master 100+ signs across alphabet, greetings, and numbers.",
    icon: Star,
    earned: false,
    progress: 82,
  },
] as const;

export const recentActivity = [
  { label: "Completed Lesson: Letter D", time: "2 hours ago", tone: "bg-primary" },
  { label: 'Practiced "Hello" with 92% accuracy', time: "5 hours ago", tone: "bg-secondary" },
  { label: 'Unlocked badge: "Quick Study"', time: "1 day ago", tone: "bg-accent" },
  { label: "Started Numbers 1-100 course", time: "2 days ago", tone: "bg-slate-400" },
] as const;

export const challengingSigns = [
  { sign: "Letter Q", accuracy: 68, attempts: 12 },
  { sign: "Letter Z", accuracy: 72, attempts: 10 },
  { sign: "Number 7", accuracy: 75, attempts: 8 },
  { sign: "Thank You", accuracy: 76, attempts: 7 },
] as const;
