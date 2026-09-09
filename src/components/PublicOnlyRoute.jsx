import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Route wrapper for public auth pages (e.g. Signin, Signup).
 * If the user is already authenticated, redirects directly to /dashboard.
 */
export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
