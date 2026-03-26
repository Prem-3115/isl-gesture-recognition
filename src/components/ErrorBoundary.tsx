/**
 * components/ErrorBoundary.tsx
 *
 * Purpose: Catches any JavaScript errors anywhere in the component tree.
 * Without this, a single runtime error crashes the entire app — users see a blank white screen.
 * With this, they see a friendly error message and can recover.
 */

import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd send this to a logging service (e.g., Sentry)
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <span className="text-4xl">⚠️</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Something went wrong
            </h1>
            <p className="mt-2 text-slate-500">
              The page encountered an unexpected error. Please refresh to try again.
            </p>
          </div>
          <button
            className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:opacity-90"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
