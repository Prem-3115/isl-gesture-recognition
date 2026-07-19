import { useState } from "react";
import { Hand, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: string;
  isLoggedIn: boolean;
  isAuthLoading?: boolean;
  userName: string;
  userPhoto?: string | null;
  onNavigate: (page: string) => void;
  onOpenAuth: (mode?: "login" | "signup") => void;
  onLogout: () => void;
}

const navItems = [
  { id: "courses", labelLoggedOut: "Courses", labelLoggedIn: "My Courses" },
  { id: "practice", labelLoggedOut: "Practice", labelLoggedIn: "Practice" },
  { id: "community", labelLoggedOut: "Community", labelLoggedIn: "Community" },
  { id: "about", labelLoggedOut: "About Us", labelLoggedIn: "About Us" },
] as const;

export function Header({
  currentPage,
  isLoggedIn,
  isAuthLoading = false,
  userName,
  userPhoto,
  onNavigate,
  onOpenAuth,
  onLogout,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: string) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNav("home")}
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="bg-primary flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground shadow-lg shadow-primary/20">
            <Hand className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-primary text-lg font-semibold leading-none">ISL Connect</p>
            <p className="mt-1 text-xs text-slate-500">AI-powered ISL learning</p>
          </div>
        </button>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const label = isLoggedIn ? item.labelLoggedIn : item.labelLoggedOut;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                aria-current={active ? "page" : undefined}
                className={`group relative pb-2 text-sm transition-colors ${
                  active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-opacity ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthLoading ? (
            // Skeleton buttons while Firebase auth resolves — no layout shift
            <div className="flex items-center gap-3 animate-pulse">
              <div className="h-9 w-20 rounded-lg bg-slate-200" />
              <div className="h-9 w-28 rounded-lg bg-slate-200" />
            </div>
          ) : isLoggedIn ? (
            <>
              <button
                onClick={() => handleNav("profile")}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1.5 pr-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                aria-label="View your profile"
              >
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={userName}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-primary/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {(userName?.[0] ?? "U").toUpperCase()}
                  </span>
                )}
                {userName}
              </button>
              <button
                onClick={onLogout}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onOpenAuth("login")}>
                Sign In
              </Button>
              <Button className="bg-primary border-0 text-primary-foreground hover:opacity-90" onClick={() => onOpenAuth("signup")}>
                Get Started
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-white/95 px-4 py-4 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navItems.map((item) => {
              const label = isLoggedIn ? item.labelLoggedIn : item.labelLoggedOut;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-4 py-3 text-left text-sm ${
                    active
                      ? "bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </button>
              );
            })}

            <div className="mt-2 grid gap-3 border-t border-slate-200 pt-4">
              {isLoggedIn ? (
                <>
                  <button
                    className="rounded-2xl bg-primary/10 px-4 py-3 text-left text-sm font-medium text-primary"
                    onClick={() => { setMobileOpen(false); onNavigate("profile"); }}
                  >
                    {userName} · View Profile
                  </button>
                  <Button variant="outline" onClick={() => { setMobileOpen(false); onLogout(); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { setMobileOpen(false); onOpenAuth("login"); }}>
                    Sign In
                  </Button>
                  <Button className="bg-primary border-0 text-primary-foreground hover:opacity-90" onClick={() => { setMobileOpen(false); onOpenAuth("signup"); }}>
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
