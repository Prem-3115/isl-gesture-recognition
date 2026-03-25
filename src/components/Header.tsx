import { useState } from "react";
import { Hand, LogOut, Menu, Sparkles, X } from "lucide-react@0.487.0";
import { Button } from "./ui/button";

interface HeaderProps {
  currentPage: string;
  isLoggedIn: boolean;
  userName: string;
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
  userName,
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
          <div className="bg-gradient-brand flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-lg shadow-primary/20">
            <Hand className="h-5 w-5" />
          </div>
          <div className="text-left">
            <p className="text-gradient-brand text-lg font-semibold leading-none">ISL Connect</p>
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
                className={`group relative pb-2 text-sm transition-colors ${
                  active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-gradient-to-r from-primary via-secondary to-accent transition-opacity ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                {userName}
              </div>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onOpenAuth("login")}>
                Sign In
              </Button>
              <Button className="bg-gradient-brand border-0 text-white hover:opacity-90" onClick={() => onOpenAuth("signup")}>
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
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{userName}</div>
                  <Button variant="outline" onClick={() => { setMobileOpen(false); onLogout(); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { setMobileOpen(false); onOpenAuth("login"); }}>
                    Sign In
                  </Button>
                  <Button className="bg-gradient-brand border-0 text-white hover:opacity-90" onClick={() => { setMobileOpen(false); onOpenAuth("signup"); }}>
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
