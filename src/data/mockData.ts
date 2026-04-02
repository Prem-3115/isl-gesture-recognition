import islChart from "@/assets/isl_chart.jpg";
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
    title: "Learn ISL Alphabet",
    description:
      "Build a strong ISL foundation with guided lessons for the ISL alphabet and beginner-friendly practice.",
    image: islChart,
    difficulty: "Beginner",
    progress: 46,
    lessonsCompleted: 4,
    totalLessons: 10,
  },
  {
    id: "greetings",
    title: "ISL Everyday Greetings",
    description:
      "Practice ISL greetings, introductions, and common social phrases used in daily conversation. Refer to the ISL chart for accurate gestures.",
    image:
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=75&fm=webp",
    difficulty: "Beginner",
    progress: 74,
    lessonsCompleted: 6,
    totalLessons: 8,
  },
  {
    id: "numbers",
    title: "ISL Numbers 1-100",
    description:
      "Learn ISL numbers with short drills, memory checks, and quick real-world practice prompts. Refer to the ISL chart for accurate gestures.",
    image: islChart,
    difficulty: "Beginner",
    progress: 20,
    lessonsCompleted: 2,
    totalLessons: 10,
  },
] as const;

export const featuredStats = [
  { value: "Structured", label: "guided lessons" },
  { value: "Interactive", label: "practice flow" },
] as const;

export const howItWorks = [
  {
    title: "Watch & Learn",
    description:
      "Follow short expert-led ISL lessons that break each sign into shape, motion, and orientation.",
    icon: Video,
    accent: "from-primary to-secondary",
  },
  {
    title: "Practice with AI",
    description:
      "Use your camera to get instant gesture recognition for ISL with confidence feedback and visual guidance.",
    icon: Camera,
    accent: "from-secondary to-accent",
  },
  {
    title: "Track & Master",
    description:
      "See weekly ISL progress, revisit difficult signs, and celebrate streaks and milestones.",
    icon: Target,
    accent: "from-accent to-primary",
  },
] as const;

export const featureTiles = [
  {
    title: "Authentic Content",
    description:
      "Lessons are structured around practical ISL (Indian Sign Language) usage and community-first learning.",
    icon: Hand,
  },
  {
    title: "AI Recognition",
    description:
      "Real-time feedback supports gesture recognition for ISL and helps learners improve positioning, confidence, and timing.",
    icon: Brain,
  },
  {
    title: "Expert Instructors",
    description:
      "Each module is framed like a guided ISL classroom session with focused repetition and clear visual cues.",
    icon: Sparkles,
  },
  {
    title: "Flexible Schedule",
    description:
      "Five-minute drills, full lessons, and ISL progress dashboards let you learn at your own pace.",
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
] as const;

export const recentSigns = [
  { sign: "Letter A", lastPracticed: "2 min ago" },
  { sign: "Letter B", lastPracticed: "18 min ago" },
  { sign: "Thank You", lastPracticed: "1 hour ago" },
  { sign: "Number 5", lastPracticed: "3 hours ago" },
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
  { id: "review-a-g", title: "Review: ISL Letters A-G", duration: "10 min", status: "todo" },
  { id: "alphabet-checkpoint", title: "ISL Alphabet Checkpoint", duration: "15 min", status: "todo" },
] as const;

export const downloadableResources = [
  { title: "ISL (Indian Sign Language) Alphabet Chart", format: "PDF", size: "2.4 MB" },
  { title: "ISL Beginner Practice Workbook", format: "PDF", size: "5.1 MB" },
  { title: "ISL Practice Checklist", format: "PDF", size: "1.8 MB" },
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
    description: "Completed the full ISL alphabet pathway.",
    icon: Award,
    earned: true,
    date: "Oct 1, 2025",
  },
  {
    name: "Greeting Guru",
    description: "Mastered 15 essential ISL greeting signs for daily conversation.",
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
    description: "Keep refining hand shapes and movement with repeated practice.",
    icon: Target,
    earned: false,
    progress: 60,
  },
  {
    name: "Century Club",
    description: "Continue exploring more ISL vocabulary across each course.",
    icon: Star,
    earned: false,
    progress: 82,
  },
] as const;

export const recentActivity = [
  { label: "Completed ISL Lesson: Letter D", time: "2 hours ago", tone: "bg-primary" },
  { label: 'Practiced ISL "Hello"', time: "5 hours ago", tone: "bg-secondary" },
  { label: 'Unlocked badge: "Quick Study"', time: "1 day ago", tone: "bg-accent" },
  { label: "Started Numbers 1-100 course", time: "2 days ago", tone: "bg-slate-400" },
] as const;

export const challengingSigns = [
  { sign: "Letter Q", note: "Review the hand orientation slowly and compare it with the chart." },
  { sign: "Letter Z", note: "Focus on the motion path and keep the hand steady between repeats." },
  { sign: "Number 7", note: "Check finger positioning before speeding up your practice." },
  { sign: "Thank You", note: "Practice the starting hand position and ending motion together." },
] as const;

// ─── Community Page Data ────────────────────────────────────────────────────

export const leaderboard = [
  { rank: 1, name: "Priya Sharma", city: "Delhi" },
  { rank: 2, name: "Arjun Mehta", city: "Mumbai" },
  { rank: 3, name: "Sneha Reddy", city: "Bengaluru" },
  { rank: 4, name: "Kabir Verma", city: "Pune" },
  { rank: 5, name: "Ananya Singh", city: "Chennai" },
  { rank: 6, name: "Rohan Desai", city: "Kolkata" },
  { rank: 7, name: "Meera Nair", city: "Hyderabad" },
  { rank: 8, name: "Vikram Joshi", city: "Jaipur" },
] as const;

export const discussions = [
  {
    id: "d1",
    author: "Priya Sharma",
    initials: "PS",
    time: "2 hours ago",
    topic: "Tips for practising ISL letters J and Z?",
    body: "I keep confusing the wrist rotation for J and Z. Any tips on how to remember the difference quickly?",
    replies: 14,
    likes: 28,
    tag: "Alphabet",
  },
  {
    id: "d2",
    author: "Kabir Verma",
    initials: "KV",
    time: "5 hours ago",
    topic: "Flask API sometimes freezes mid-session",
    body: "When my hand goes out of frame for a second the prediction stops and I have to restart the camera. Anyone else?",
    replies: 8,
    likes: 12,
    tag: "Practice",
  },
  {
    id: "d3",
    author: "Sneha Reddy",
    initials: "SR",
    time: "1 day ago",
    topic: "Completed the ISL greetings course — my experience",
    body: "Just finished the everyday greetings module. The AI feedback was incredibly helpful, especially when repeating signs slowly before speeding up.",
    replies: 22,
    likes: 47,
    tag: "Milestone",
  },
  {
    id: "d4",
    author: "Meera Nair",
    initials: "MN",
    time: "2 days ago",
    topic: "Resources for ISL Number signs beyond 20?",
    body: "The course only goes up to 10. Has anyone found good reference material for ISL numbers in the 20-100 range?",
    replies: 6,
    likes: 9,
    tag: "Resources",
  },
] as const;

export const studyGroups = [
  {
    id: "sg1",
    name: "Alphabet & Basics",
    description: "For newcomers mastering the 26 ISL alphabets and foundational hand shapes.",
    icon: Hand,
    accent: "from-primary to-secondary",
    tag: "Beginner",
  },
  {
    id: "sg2",
    name: "Daily Practice Group",
    description: "Commit to regular practice sessions and keep each other accountable.",
    icon: Flame,
    accent: "from-secondary to-accent",
    tag: "Active",
  },
  {
    id: "sg3",
    name: "ISL Educators",
    description: "Teachers, therapists, and healthcare professionals learning ISL for work.",
    icon: Sparkles,
    accent: "from-accent to-primary",
    tag: "Professional",
  },
  {
    id: "sg4",
    name: "Peer Feedback Circle",
    description: "Share practice clips, compare techniques, and get peer feedback.",
    icon: Trophy,
    accent: "from-primary via-secondary to-accent",
    tag: "Competitive",
  },
] as const;

export const signOfTheDay = {
  sign: "NAMASTE",
  description: "The classic Indian greeting — place both palms together in front of your chest, fingers pointing upward, and give a small bow of the head.",
  category: "Greetings",
} as const;

export const communityEvents = [
  {
    id: "e1",
    title: "ISL Alphabet Speed Round",
    date: "Apr 5, 2026",
    time: "6:00 PM IST",
    type: "Live Challenge",
    interested: 38,
  },
  {
    id: "e2",
    title: "Beginner Q&A with the ISL team",
    date: "Apr 10, 2026",
    time: "5:00 PM IST",
    type: "Webinar",
    interested: 120,
  },
  {
    id: "e3",
    title: "Weekly Community Check-In",
    date: "Every Sunday",
    time: "12:00 AM IST",
    type: "Recurring",
    interested: 0,
  },
] as const;

export const communityStats: { label: string; value: string }[] = [] as const;

export const faqs = [
  {
    q: "What is ISL Connect?",
    a: "ISL Connect is an AI-powered platform for learning Indian Sign Language (ISL). It combines structured video lessons, real-time gesture recognition via your webcam, and progress tracking to make daily ISL practice feel approachable.",
  },
  {
    q: "Do I need any special hardware to use the gesture recognition?",
    a: "No special hardware is needed — just a standard webcam. The AI recognition uses MediaPipe and runs directly in your browser. You also need the local Flask backend running on your machine for the ML model to work.",
  },
  {
    q: "How does the AI gesture recognition work?",
    a: "When you start a practice session, your webcam feed is processed by MediaPipe to extract 21 hand landmarks. These landmarks are sent to a local Flask API that runs a trained ML classifier to identify which ISL sign you are performing, along with a confidence score.",
  },
  {
    q: "Is my camera footage stored or sent to any server?",
    a: "No. All camera processing happens locally in your browser and on your machine. No video is recorded or transmitted to any external server.",
  },
  {
    q: "Why does gesture recognition show 'Flask API is offline'?",
    a: "The gesture recognition needs the local Python backend running. Open a terminal, go to the 'backend' folder, and run: python isl_api.py. Once it starts on port 5000, the system status will update automatically.",
  },
  {
    q: "How do I track my progress?",
    a: "Use the Achievements page as a reflection space for recent activity, learning highlights, and signs worth revisiting in your next practice session.",
  },
  {
    q: "Can I use ISL Connect without creating an account?",
    a: "You can browse the homepage and course listings without an account. To access lessons, practice mode, achievements, and the community, you will need to sign in or create a free account.",
  },
  {
    q: "What ISL content is currently available?",
    a: "ISL Connect currently covers the ISL Alphabet (26 letters), Everyday Greetings, and Numbers 1-100 across three beginner-level courses. More modules covering common words, family, and daily phrases are planned.",
  },
] as const;
