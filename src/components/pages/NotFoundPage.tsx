import { useNavigate } from "react-router";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";

export function NotFoundPage() {
  useEffect(() => {
    document.title = "Page Not Found — ISL Connect";
  }, []);

  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
        <AlertTriangle className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        404 — Not Found
      </p>
      <h1 className="text-4xl font-semibold text-slate-950 sm:text-5xl">
        Page doesn't exist
      </h1>
      <p className="mt-4 max-w-md text-slate-600">
        The page you were looking for couldn't be found. It may have been moved
        or the URL might be incorrect.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="h-11 rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Go Back
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="bg-gradient-brand h-11 rounded-xl border-0 text-white hover:opacity-90"
        >
          <Home className="mr-2 h-4 w-4" aria-hidden="true" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
