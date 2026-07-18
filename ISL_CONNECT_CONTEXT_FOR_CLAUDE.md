# ISL Connect — Full UI Context for Claude

> Use this document to understand the complete UI structure, design system, page-by-page breakdown, what works, and what doesn't — before making any changes.

---

## 0. Screenshots of All Pages (Actual App)

### Home Page (`/`)
![Home Page](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_home_1784364519128.png)

### Course Dashboard (`/courses`) — shows 404 when visited directly by browser (auth redirect)
![Courses 404](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_courses_1784364541185.png)

### Lesson Page (`/lesson/intro-isl`)
![Lesson Page](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_lesson_1784364557398.png)

### Practice Page (`/practice`)
![Practice Page](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_practice_1784364574804.png)

### Achievements Page (`/achievements`) — shows as guest ("User", 0 XP)
![Achievements Page](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_achievements_1784364699594.png)

### Community Page (`/community`)
![Community Page](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_community_1784364785500.png)

### About Page (`/about`)
![About Page](C:/Users/Shrey/.gemini/antigravity-ide/brain/9eebbe92-1eb0-436b-8bb9-4e1d0f52b5ae/page_about_1784364805747.png)

---

## 1. Project Overview

**ISL Connect** is a React + TypeScript web app (Vite, port 3000) for learning Indian Sign Language. It has:
- Structured video lessons
- AI-powered gesture recognition (webcam + Flask backend)
- Progress tracking, achievements, community

**Stack:** React 18, TypeScript, React Router v7, Tailwind CSS v4, shadcn/ui components, Firebase Auth + Firestore, Sonner (toast notifications), Lucide icons.

---

## 2. Design System (globals.css + index.css)

### Color Tokens (Light Mode)
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#0f172a` (slate-950) | Buttons, headings, active nav, brand color |
| `--primary-foreground` | `#ffffff` | Text on primary bg |
| `--secondary` | `#64748b` (slate-500) | Secondary text, muted accents |
| `--accent` | `#059669` (emerald-600) | Accent highlights |
| `--background` | `#f8fafc` (slate-50) | Page background |
| `--card` | `#ffffff` | Card backgrounds |
| `--muted` | `#f1f5f9` | Section backgrounds |
| `--border` | `rgba(148,163,184,0.2)` | Card/input borders |

### Custom Shadow Tokens
- `shadow-elevation` → `0 8px 30px rgba(0,0,0,0.04)` — default card hover effect
- `shadow-elevation-hover` → `0 14px 40px rgba(0,0,0,0.08)` — deeper hover effect

### Typography
- **Font:** Inter (Google Fonts), loaded in `index.css`
- **Base size:** 16px
- All headings/body use Inter with weight 400–700

### Border Radius
- `--radius: 0.75rem` (12px base)
- Cards use `rounded-xl` to `rounded-[2rem]` for premium feel

---

## 3. File Structure (Key Files)

```
src/
├── App.tsx                         # Root — RouterProvider + Toaster
├── routes.tsx                      # All route definitions
├── index.css                       # Imports Inter, Tailwind, globals
├── styles/globals.css              # All CSS tokens + theme
├── assets/
│   ├── isl_chart.jpg               # ISL alphabet chart (73kb) — used in Hero + LessonPage sidebar
│   ├── course1.jpg                 # Alphabet course card image
│   ├── course2.jpg                 # Greetings course card image
│   └── course3.png                 # Numbers course card image
├── data/
│   └── mockData.ts                 # All static content (courses, testimonials, FAQs, community data, etc.)
├── components/
│   ├── Header.tsx                  # Sticky nav header
│   ├── Footer.tsx                  # Site footer
│   ├── Layout.tsx                  # Shared layout wrapper (wraps all pages)
│   ├── CourseCard.tsx              # Reusable course card component
│   ├── AuthModal.tsx               # Login/Signup modal (Firebase Auth)
│   ├── ErrorBoundary.tsx           # Error boundary wrapper
│   ├── SkeletonCard.tsx            # Loading skeleton
│   ├── FAQModal.tsx                # FAQ modal
│   ├── figma/
│   │   └── ImageWithFallback.tsx   # Image with error fallback
│   ├── ui/                         # shadcn/ui components (button, progress, table, etc.)
│   └── pages/
│       ├── HomePage.tsx            # Landing page (public)
│       ├── CourseDashboard.tsx     # My Courses dashboard (auth required)
│       ├── CoursePage.tsx          # Single course detail page
│       ├── LessonPage.tsx          # Individual lesson with YouTube embed
│       ├── PracticePage.tsx        # AI gesture recognition webcam page
│       ├── AchievementsPage.tsx    # Progress & badges page
│       ├── CommunityPage.tsx       # Community discussions, groups, events
│       ├── AboutPage.tsx           # About the project and team
│       └── NotFoundPage.tsx        # 404 page
```

---

## 4. Page-by-Page UI Breakdown

### 4.1 Header (sticky, all pages)
**File:** `src/components/Header.tsx`

**Structure:**
- Logo (Hand icon + "ISL Connect" + subtitle "AI-powered ISL learning")
- Nav links: Courses / My Courses | Practice | Community | About Us
- Right side (logged out): "Sign In" (ghost) + "Get Started" (primary) buttons
- Right side (logged in): Username pill (primary/10 bg) + "Logout" button
- Mobile: hamburger menu with dropdown
- Style: `sticky top-0 z-50`, `bg-white/80 backdrop-blur-xl`, `border-b border-white/60`
- Active nav item: gradient underline (primary → secondary → accent)

---

### 4.2 Home Page (`/`)
**File:** `src/components/pages/HomePage.tsx`

**Sections (top to bottom):**

1. **Hero Section** — 2-column grid (lg screens)
   - Left: Badge ("Intelligent practice for modern ISL learners"), H1 heading, body text, 2 CTA buttons ("Start Free Lesson" → auth or lesson-a, "Explore Courses" → dashboard), featured stats grid (2 stats)
   - Right: `isl_chart.jpg` in a rounded card (`rounded-[2rem] shadow-elevation`), floating tooltip card below-left ("Practice with live feedback")
   - Background: plain white/slate-50

2. **How It Works** — `bg-slate-50 border-y` section
   - Label ("HOW IT WORKS"), H2 heading
   - 3-column grid of step cards (Watch & Learn, Practice with AI, Track & Master)
   - Each card: icon in slate-100 square, step number (large light gray), title, description

3. **Popular Courses** — white background section
   - Label + H2 + "View All Courses" outline button
   - 3-column `CourseCard` grid (uses `course1.jpg`, `course2.jpg`, `course3.png`)

4. **Why ISL Connect** — `bg-slate-50 border-y`
   - Label + H2
   - 4-column feature tiles (Authentic Content, AI Recognition, Expert Instructors, Flexible Schedule)

5. **Testimonials** — white background
   - Label + H2
   - 3-column testimonial cards (star rating, quote, avatar initials + name + role)

6. **CTA Banner** — dark gradient (`from-slate-900 to-slate-950`)
   - Heading + "Sign Up Free" / "Go to Dashboard" button
   - Decorative blur circle (white/5)

---

### 4.3 Course Dashboard (`/courses`)
**File:** `src/components/pages/CourseDashboard.tsx`

**Auth:** Required (redirects to login if not authenticated)

**Sections:**
1. **Header** — "DASHBOARD" label, personalized greeting ("Good morning, Shrey 👋"), dynamic progress message
2. **XP + Streak Banner** — 4-column stat grid
   - XP Level card (wide, 2 cols): Level N, XP total, XP to next level, progress bar
   - Streak card: flame icon, N-day streak, "🔥 You're on a roll!" if ≥3
   - Lessons Done card: trophy icon, X/10 lessons, progress bar
   - All cards: `rounded-[1.75rem]`, hover lift + shadow-elevation
3. **Continue + Sign of the Day** — 2-column grid
   - Dark hero card: "Continue Learning" / "Resume: ..." or "Start Your First Lesson", 2 buttons (Continue, Open Practice)
   - Sign of the Day card: calendar icon, letter/number of the day (cycles daily), "Practice X Now" button
4. **Focus Cards** — 3-column grid (Continue Learning, Daily Practice, Build Your Streak)
5. **Active Courses** — H2 + "Browse More" button + 3-column `CourseCard` grid
6. **Recently Practiced Signs** — H2 + "Open Practice" button + Table (Sign | Last Practiced | Action)

---

### 4.4 Lesson Page (`/lesson/:id`)
**File:** `src/components/pages/LessonPage.tsx`

**Auth:** Required for marking complete; lesson content is viewable

**Supported lesson IDs:** intro-isl, letter-a through letter-g, review-a-g, alphabet-checkpoint, number-1 through number-9

**Structure:**
- Breadcrumb navigation (Courses → Course Name → Lesson)
- 2-column layout: **Left (main)** — YouTube embed (youtube-nocookie.com), lesson title + description, "Mark as Complete" / "Already Complete" button, Prev/Next lesson nav; **Right (sidebar)** — ISL chart reference (`isl_chart.jpg`), lesson list with status icons (done ✓ / in-progress → / todo)
- For unsupported lessons (no direct recognition): a note card with ISL chart reference instead of practice button

---

### 4.5 Practice Page (`/practice`)
**File:** `src/components/pages/PracticePage.tsx`

**Auth:** Required

**Supported signs:** 1–9, C (10 classes — limited by the ML model)
**All signs listed in UI:** A–Z + 1–9 (35 total, but only 10 are AI-recognizable)

**Structure:**
1. **System Status Banner** — checks `http://127.0.0.1:5000/health` every 5 seconds. Shows "Flask API Online" (green) or "Flask API Offline" (red/amber). **Currently always offline** since no model .pkl files are present.
2. **Sign Selector** — grid of all 35 signs, SUPPORTED ones highlighted in primary color, unsupported grayed out
3. **Webcam Camera Feed** — live webcam via MediaPipe `hand_landmarker.task` (loaded from CDN), draws hand landmarks on canvas
4. **AI Prediction Panel** — shows current sign being detected, confidence bar, EMA-smoothed result. Uses `/predict` Flask endpoint.
5. **Stats Panel** — streak count, session score (confetti on milestones), "Top Score" tracker
6. **ISL Chart reference** — `isl_chart.jpg` shown below as reference
7. **Confetti component** — particle animation on correct signs

**Key note:** MediaPipe runs in browser; Flask backend needed for final classification.

---

### 4.6 Achievements Page (`/achievements`)
**File:** `src/components/pages/AchievementsPage.tsx`

**Auth:** Required. Pulls real `completedLessons` from Firestore.

**Sections:**
1. **Profile Banner** — primary-colored full-width banner: avatar initial, username, Level N, XP, XP progress bar, stats pills (streak, lessons, badges)
2. **Real Stats** — 4-column cards: Lessons Completed, Total XP, Day Streak, Badges Earned
3. **Learning Highlights** — 8 dynamic badges grid (earned = emerald glow; unearned = gray + progress bar)
   - Badges: First Step, Alphabet Apprentice, Halfway There, Full Alphabet, Streak Starter, Dedicated Learner, XP 500, XP 1000
4. **ISL Learning Milestones** — static `achievements` from mockData (6 items) — displayed as cards
5. **Suggested Review Signs** — table with 4 signs (Letter Q, Z, Number 7, Thank You) + practice notes + "Practice" buttons

---

### 4.7 Community Page (`/community`)
**File:** `src/components/pages/CommunityPage.tsx`

**Auth:** Not required to view; required to interact (post, join groups, like)

**Sections:**
1. **Header** — H1 + description + community stats row (50K+ Members, 2.4M Signs Practised, 18K+ Posts, 340+ Sessions)
2. **Discussion Board** — list of 4 mock discussions + user-posted ones (local state). Each card: avatar, author, time, topic, body, tag badge, like/reply counts. Features: Like toggle, Reply inline textarea, Delete own posts.
3. **Compose New Post** — slide-down panel (topic input + body textarea + tag selector + post button)
4. **Study Groups** — 4 group cards (Alphabet & Basics, Daily Practice Group, ISL Educators, High Score Hunters). Each: icon, member count, tag, Join/Leave toggle button.
5. **Sign of the Day** — "NAMASTE" card with category, description, practice count, top accuracy
6. **Events** — 3 event cards (ISL Alphabet Speed Round, Beginner Q&A, Weekly Leaderboard). Each: title, date, time, type tag, "Interested" counter button.

---

### 4.8 About Page (`/about`)
**File:** `src/components/pages/AboutPage.tsx`

**Public** (no auth required)

**Sections:**
1. **Hero** — gradient background header, H1 ("Making Indian Sign Language accessible to all"), subtitle text, Sparkles badge ("About ISL Connect")
2. **Values Grid** — 4 value cards with gradient icon squares (Inclusion First, AI-Powered Learning, Deliberate Practice, Community Driven)
3. **Mission Statement** — text block explaining the student project origins
4. **Tech Stack** — list of technologies used (React, MediaPipe, Flask, Firebase, etc.)
5. **Team** — 3 team member cards (initials avatar, name, role): Shrey Shah (Project Lead & ML Engineer), 2 Project Members
6. **CTA** — "Start Learning" button → navigates to dashboard/signup

---

### 4.9 Auth Modal (overlay, all pages)
**File:** `src/components/AuthModal.tsx`

- Login and Signup tabs
- Email + Password fields
- Firebase Auth integration (createUserWithEmailAndPassword / signInWithEmailAndPassword)
- Responsive modal centered on screen
- Used via `onOpenAuth("login")` / `onOpenAuth("signup")` context function

---

## 5. Navigation / Routing

**All routing** is custom — no `<Link>` components used. Instead: `onNavigate(target)` function passed via Outlet context.

**Navigation targets → routes:**
| `onNavigate` call | Goes to |
|---|---|
| `"home"` | `/` |
| `"dashboard"` or `"courses"` | `/courses` |
| `"practice"` | `/practice` |
| `"community"` | `/community` |
| `"about"` | `/about` |
| `"achievements"` | `/achievements` |
| `"lesson:intro-isl"` | `/lesson/intro-isl` |
| `"course:alphabet"` | `/course/alphabet` (CoursePage) |

---

## 6. What's Working ✅

| Feature | Status |
|---|---|
| Firebase Auth (signup/login/logout) | ✅ Working |
| Firestore lesson progress sync | ✅ Working |
| YouTube lesson embeds (A–G, intro, numbers) | ✅ Working (browser tracking prevention warnings are cosmetic) |
| XP + Streak (localStorage) | ✅ Working |
| Dynamic achievements based on real data | ✅ Working |
| Course cards with real images | ✅ Working (course1.jpg, course2.jpg, course3.png in src/assets/) |
| ISL Chart in hero + lesson sidebar | ✅ Working (isl_chart.jpg in src/assets/) |
| MediaPipe hand detection in browser | ✅ Working |
| Community page interactions (like/join/post/reply) | ✅ Working (local state, not persisted) |
| Responsive layout + mobile nav | ✅ Working |
| Sonner toast notifications | ✅ Working |

---

## 7. What's NOT Working / Pending ❌

| Feature | Status | Reason |
|---|---|---|
| AI gesture classification (Flask /predict) | ❌ Offline | `isl_model.pkl` + `label_encoder.pkl` not present in `backend/` |
| Backend health check | ❌ Always "Offline" | Same reason — Flask won't start without model files |
| Lesson mark-as-complete for non-auth users | ❌ Blocked | Requires login, shows AuthModal |
| YouTube embeds in Edge with strict tracking prevention | ⚠️ Warning | Cosmetic only — video still plays |
| Firestore blocked by ad-blocker | ⚠️ Warning | Does not break app — just means progress may not sync for blocked users |
| Community data persistence | ❌ Not persisted | All interactions (like, join, post) reset on page refresh — local state only |

---

## 8. CourseCard Component

**File:** `src/components/CourseCard.tsx`

Props: `id`, `title`, `description`, `image`, `difficulty`, `onViewCourse`

Structure:
- `image` — top-half card image, `object-cover h-48 w-full`
- `difficulty` badge — pill (currently always "Beginner")
- `title` — bold heading
- `description` — 2-line clamped text
- "View Course" button → calls `onViewCourse(id)`

---

## 9. Design Patterns to Preserve

When making UI changes, **always preserve these patterns:**

1. **No React Router `<Link>`** — all navigation via `onNavigate()` from `useOutletContext<LayoutOutletContext>()`
2. **Auth check pattern** — check `isLoggedIn` from outlet context before navigating to protected pages; call `onOpenAuth()` otherwise
3. **Firestore data** — `fetchCompletedLessons(user.uid)` from `@/services/progress.service` — do NOT replace with mock data
4. **isl_chart.jpg** — must stay in `src/assets/isl_chart.jpg` and be imported where needed
5. **Course images** — `course1.jpg`, `course2.jpg`, `course3.png` in `src/assets/` — imported in `src/data/mockData.ts`
6. **CSS tokens** — modify only in `src/styles/globals.css` `:root {}` block, not inline styles
7. **shadcn/ui components** — Button, Progress, Table, Breadcrumb etc. are in `src/components/ui/` — use them, don't replace with raw HTML
8. **Toasts** — use `toast.success()` / `toast.error()` from "sonner"

---

## 10. Screenshots Reference (All Pages)

| Page | Screenshot File | Notes |
|---|---|---|
| Home `/` | `page_home_1784364519128.png` | Logged in state — shows "Go to Dashboard" CTA |
| Courses `/courses` | `page_courses_1784364541185.png` | Shows 404 — direct URL visit bypasses auth, route mismatch |
| Lesson `/lesson/intro-isl` | `page_lesson_1784364557398.png` | Intro to ISL, YouTube embed, ISL chart sidebar |
| Practice `/practice` | `page_practice_1784364574804.png` | Camera inactive, Flask API Offline, MediaPipe Ready |
| Achievements `/achievements` | `page_achievements_1784364699594.png` | Guest/logged-out state — shows "User", 0 XP, 0 lessons |
| Community `/community` | `page_community_1784364785500.png` | Full page — discussions, groups, events, NAMASTE sign |
| About `/about` | `page_about_1784364805747.png` | Mission, values, team (Shrey Shah + 2 Project Members) |

> **Note on `/courses` 404:** When navigated to directly via URL bar, `/courses` hits a 404 because the app uses React Router client-side routing. The correct way is to navigate from within the app using the "My Courses" nav link.

---

## 11. Backend Info (for context)

- **Flask API:** `backend/isl_api.py`, port 5000
- **Endpoints:** `GET /health`, `POST /predict` (expects `{"landmarks": [...]}`)
- **Missing files:** `isl_model.pkl`, `label_encoder.pkl` — waiting for friend to share
- **MediaPipe task file:** `backend/hand_landmarker.task` (7.8MB) — present

---

*Last updated: 2026-07-18*
*Project repo: https://github.com/Prem-3115/isl-gesture-recognition*
