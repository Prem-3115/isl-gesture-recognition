import { useEffect, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { toast } from "sonner@2.0.3";
import { LayoutOutletContext } from "@/types/layout";
import { AuthModal } from "./AuthModal";
import { Footer } from "./Footer";
import { Header } from "./Header";

const protectedPrefixes = ["/dashboard", "/course/", "/lesson/", "/practice", "/achievements"];

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
    community: "/",
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
    return "community";
  }
  return "home";
}

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Priya");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (!isLoggedIn && isProtectedPath(location.pathname)) {
      setAuthMode("login");
      setIsAuthOpen(true);
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

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

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
    setIsAuthOpen(false);
    navigate("/dashboard");
    toast.success(`Welcome back, ${name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("Priya");
    navigate("/");
    toast.success("Logged out successfully.");
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
        onLogin={handleLogin}
        initialMode={authMode}
      />
    </div>
  );
}
