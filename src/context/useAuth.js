import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Custom hook to safely consume the authentication context.
 * Throws a clear error if used outside of an AuthProvider tree.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
