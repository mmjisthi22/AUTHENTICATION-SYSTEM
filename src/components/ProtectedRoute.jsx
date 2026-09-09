import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { Loader2 } from "lucide-react";

/**
 * Route wrapper that only permits authenticated users.
 * Redirects unauthenticated visitors to /signin and stores the previous location.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
