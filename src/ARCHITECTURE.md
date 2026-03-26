# ISL Connect — Project Architecture

## Folder Structure

```
src/
├── assets/          # Static files (images, fonts)
├── components/
│   ├── pages/       # Full page components (one per route)
│   ├── ui/          # Reusable design system components (Radix/shadcn)
│   ├── Layout.tsx   # App shell (header, footer, auth state)
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── AuthModal.tsx
├── constants/       # ✅ App-wide constants (routes, config values)
│   └── routes.ts    # All route paths as typed constants
├── context/         # React context providers (state management)
│   ├── AuthContext.tsx   # Auth state — uses service layer
│   └── GestureContext.tsx
├── data/            # Static/seed data and domain data
│   ├── islSigns.ts  # ISL sign definitions
│   └── mockData.ts  # UI placeholder data
├── hooks/           # ✅ Custom React hooks (public API for contexts/logic)
│   ├── useAuth.ts
│   └── useGestureRecognition.ts
├── lib/             # External library initialization only
│   └── firebase.ts  # Firebase app init (no business logic here)
├── services/        # ✅ Business logic & external API calls
│   ├── auth.service.ts   # All Firebase Auth operations
│   ├── user.service.ts   # All Firestore user operations
│   └── index.ts
├── styles/          # Global CSS
├── types/           # ✅ Shared TypeScript type definitions
│   ├── user.ts
│   ├── layout.ts
│   └── index.ts
├── utils/           # ✅ Pure utility functions (no side effects)
│   ├── cn.ts        # className merger
│   └── index.ts
├── routes.tsx       # Route definitions (lazy-loaded)
├── App.tsx
└── main.tsx
```

---

## Layer Rules (Separation of Concerns)

| Layer | Responsibility | Can Import From |
|---|---|---|
| `components/` | Render UI only | `hooks/`, `types/`, `utils/`, `constants/` |
| `hooks/` | React state/effects | `services/`, `context/`, `types/` |
| `context/` | Global React state | `services/`, `lib/`, `types/` |
| `services/` | Business logic, API calls | `lib/`, `types/` |
| `lib/` | SDK initialization | Nothing project-internal |
| `types/` | Type definitions | Nothing |
| `constants/` | Static values | Nothing |
| `utils/` | Pure functions | Nothing project-internal |

> ❌ **Bad**: A component importing directly from `firebase/auth`  
> ✅ **Good**: A component using `useAuth()` → service → firebase

---

## Import Patterns (Use These)

```tsx
// ✅ Types
import type { UserProfile } from "@/types";

// ✅ Auth state in components
import { useAuth } from "@/hooks/useAuth";

// ✅ Route constants
import { ROUTES } from "@/constants";

// ✅ Utility
import { cn } from "@/utils";

// ✅ Services (only in contexts/hooks, not components)
import { loginWithEmail } from "@/services";
```
