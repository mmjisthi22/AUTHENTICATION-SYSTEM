import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle2,
  Copy,
  KeyRound,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

import { useAuth } from "@/context/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthAlert } from "@/components/ui/auth-alert";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Profile update state
  const initialName = user?.user_metadata?.full_name || "";
  const [fullName, setFullName] = useState(initialName);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Sign out error:", err);
      setIsLoggingOut(false);
    }
  };

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsUpdatingProfile(true);
      setProfileMessage(null);

      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (error) throw error;
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      console.error("Update profile error:", err);
      setProfileMessage({ type: "error", text: err?.message || "Failed to update profile." });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Authenticated User";

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const provider = user?.app_metadata?.provider || "email";
  const isEmailVerified = !!user?.email_confirmed_at;

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="size-5" />
            </div>
            <span className="font-heading font-bold tracking-wider text-sm sm:text-base uppercase">
              AuthCore
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Session Active</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-destructive/40"
            >
              {isLoggingOut ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <LogOut className="size-3.5" />
              )}
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-r from-card via-card/80 to-secondary/30 p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-full border-2 border-primary/20 bg-primary/10 text-primary font-bold text-xl flex items-center justify-center shadow-inner">
                {getInitials(displayName)}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight font-heading">
                  Welcome back, {displayName}!
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Mail className="size-3.5" />
                  <span>{user?.email}</span>
                  {isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="size-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      Pending Verification
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-background/60 border border-border/80 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-semibold uppercase tracking-wider text-primary">
                {provider}
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Details & Identity */}
          <Card className="md:col-span-2 border-border/70 shadow-sm bg-card/90">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <CardTitle className="text-base tracking-wide uppercase font-semibold">
                  Account Overview
                </CardTitle>
              </div>
              <CardDescription>
                Detailed credentials and security metadata for your session.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User ID */}
                <div className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-secondary/20">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                    User Identifier
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-foreground truncate">
                      {user?.id}
                    </span>
                    <button
                      onClick={handleCopyId}
                      className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Copy User ID"
                    >
                      {copiedId ? (
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-secondary/20">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
                    Email Address
                  </span>
                  <span className="text-xs text-foreground truncate font-medium">
                    {user?.email}
                  </span>
                </div>

                {/* Account Created At */}
                <div className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-secondary/20">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3" /> Account Created
                  </span>
                  <span className="text-xs text-foreground font-medium">
                    {formatDate(user?.created_at)}
                  </span>
                </div>

                {/* Last Sign In */}
                <div className="flex flex-col gap-1 p-3 rounded-lg border border-border/50 bg-secondary/20">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <KeyRound className="size-3" /> Last Authenticated
                  </span>
                  <span className="text-xs text-foreground font-medium">
                    {formatDate(user?.last_sign_in_at)}
                  </span>
                </div>
              </div>

              {/* Profile Update Form */}
              <div className="pt-4 border-t border-border/60">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-muted-foreground mb-3">
                  Update Display Name
                </h3>

                {profileMessage && (
                  <div className="mb-3">
                    <AuthAlert
                      type={profileMessage.type}
                      message={profileMessage.text}
                    />
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="px-2"
                      disabled={isUpdatingProfile}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isUpdatingProfile || fullName.trim() === initialName}
                    size="sm"
                    className="cursor-pointer sm:w-auto"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader2 className="size-3.5 animate-spin mr-1.5" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Security & System Info */}
          <div className="space-y-6">
            <Card className="border-border/70 shadow-sm bg-card/90">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <CardTitle className="text-base tracking-wide uppercase font-semibold">
                    System Status
                  </CardTitle>
                </div>
                <CardDescription>
                  Live authentication indicators
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Auth Gateway:</span>
                  <span className="font-semibold text-emerald-400">Connected</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Storage Engine:</span>
                  <span className="font-mono text-[11px] text-foreground">Supabase PostgreSQL</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border/40">
                  <span className="text-muted-foreground">Token Scheme:</span>
                  <span className="font-mono text-[11px] text-foreground">JWT (HS256 / RS256)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Client Mode:</span>
                  <span className="text-foreground font-medium">React 19 + Vite</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm bg-card/90">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="size-4 text-primary" />
                  <CardTitle className="text-base tracking-wide uppercase font-semibold">
                    Quick Links
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/reset-password")}
                  className="w-full justify-start text-xs cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  <KeyRound className="size-3.5 mr-2" />
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full justify-start text-xs cursor-pointer text-muted-foreground hover:text-destructive hover:border-destructive/40"
                >
                  <LogOut className="size-3.5 mr-2" />
                  End Active Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
