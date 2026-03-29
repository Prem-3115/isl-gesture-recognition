import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner@2.0.3";
import { LoaderCircle } from "lucide-react@0.487.0";
import { LayoutOutletContext } from "@/types/layout";
import { AuthModal } from "./AuthModal";
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
    faqs: "/faqs",
    about: "/",
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
  return "home";
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, isLoggedIn, logout, isLoading: isAuthLoading } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

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

  const outletContext = useMemo<LayoutOutletContext>(
    () => ({
      onNavigate: handleNavigate,
      isLoggedIn,
      userName,
      onOpenAuth: handleOpenAuth,
    }),
    [isLoggedIn, userName],
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
      <Header
        currentPage={getCurrentSection(location.pathname)}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onNavigate={handleNavigate}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />
      <main className="flex-1">
        <Outlet context={outletContext} />
      </main>
      <Footer onNavigate={handleNavigate} />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
