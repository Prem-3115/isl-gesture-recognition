import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { LayoutOutletContext } from "@/types/layout";
import { AuthModal } from "./AuthModal";
import { FAQModal } from "./FAQModal";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useAuth } from "../context/AuthContext";

const protectedPrefixes = ["/dashboard", "/course/", "/lesson/", "/practice", "/achievements", "/community"];

function isProtectedPath(pathname: string) {
  return protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
}

function resolveRoute(page: string) {
  if (page.startsWith("/")) {
    return page;
  }

  if (page.startsWith("course:")) {
    return `/course/${page.split(":")[1]}`;
  }

  if (page.startsWith("lesson:")) {
    return `/lesson/${page.split(":")[1]}`;
  }

  const routeMap: Record<string, string> = {
    home: "/",
    dashboard: "/dashboard",
    practice: "/practice",
    achievements: "/achievements",
    courses: "/dashboard",
    community: "/community",
    about: "/about",
  };

  return routeMap[page] ?? "/";
}

function getCurrentSection(pathname: string) {
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/course/") || pathname.startsWith("/lesson/")) {
    return "courses";
  }
  if (pathname.startsWith("/practice")) {
    return "practice";
  }
  if (pathname.startsWith("/achievements")) {
    return "achievements";
  }
  if (pathname.startsWith("/community")) {
    return "community";
  }
  if (pathname.startsWith("/about")) {
    return "about";
  }
  return "home";
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isLoggedIn, logout, isLoading: isAuthLoading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  const userName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || "User";

  useEffect(() => {
    if (!isAuthLoading && !isLoggedIn && isProtectedPath(location.pathname)) {
      setAuthMode("login");
      setIsAuthOpen(true);
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, isAuthLoading, location.pathname, navigate]);

  const handleOpenAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleNavigate = (page: string) => {
    const targetRoute = resolveRoute(page);
    if (!isLoggedIn && isProtectedPath(targetRoute)) {
      setAuthMode("signup");
      setIsAuthOpen(true);
      return;
    }
    navigate(targetRoute);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  // FIX: include handleNavigate and handleOpenAuth so the memoized context
  // never captures stale closures when auth state changes.
  const outletContext = useMemo<LayoutOutletContext>(
    () => ({
      onNavigate: handleNavigate,
      isLoggedIn,
      userName,
      onOpenAuth: handleOpenAuth,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoggedIn, userName, handleNavigate, handleOpenAuth],
  );

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip-to-content link for keyboard / screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header
        currentPage={getCurrentSection(location.pathname)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />
      <main id="main-content" className="flex-1">
        <Outlet context={outletContext} />
      </main>
      <Footer onNavigate={handleNavigate} onOpenFaq={() => setIsFaqOpen(true)} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
      <FAQModal 
        isOpen={isFaqOpen} 
        onClose={() => setIsFaqOpen(false)} 
      />
    </div>
  );
}

