import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

import { useAuth } from "@/context/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AuthAlert } from "@/components/ui/auth-alert";

// Human-written Zod validation schema for sign-in
const signinSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function Signin() {
  const { signIn, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);

  // Where to redirect after successful login
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      setIsSubmitting(true);
      await signIn({
        email: data.email.trim(),
        password: data.password,
      });

      // Successful login -> navigate to intended destination
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Sign in failed:", err);
      // Format friendly error message
      if (err?.message?.toLowerCase().includes("invalid login credentials")) {
        setErrorMessage("Invalid email or password. Please double-check your credentials.");
      } else if (err?.message?.toLowerCase().includes("email not confirmed")) {
        setErrorMessage("Your email address has not been confirmed yet. Please check your inbox.");
      } else {
        setErrorMessage(err?.message || "An unexpected error occurred during sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setErrorMessage("");
      setOauthLoading(provider);
      await signInWithOAuth(provider);
    } catch (err) {
      console.error(`${provider} OAuth failed:`, err);
      setErrorMessage(err?.message || `Failed to sign in with ${provider}.`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background antialiased">
      {/* Background glow styling */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <Card className="relative w-full max-w-md border-border/70 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-secondary/40">
            <Lock className="size-5 text-primary" />
          </div>
          <CardTitle className="text-xl tracking-wider uppercase font-semibold">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Enter your credentials to securely access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-2">
          {errorMessage && <AuthAlert type="error" message={errorMessage} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="signin-email" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Email Address
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="px-2"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                <Mail className="size-4 text-muted-foreground/60 absolute right-2 pointer-events-none" />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive font-medium mt-0.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="signin-password" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                  Password
                </FieldLabel>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="px-2 pr-9"
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 p-1 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 h-10 cursor-pointer transition-transform active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Social Sign In Divider */}
          <div className="relative my-4">
            <Separator className="my-2" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Or continue with
            </span>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting || !!oauthLoading}
              onClick={() => handleOAuthLogin("github")}
              className="w-full text-xs normal-case tracking-normal cursor-pointer"
            >
              {oauthLoading === "github" ? (
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
              ) : (
                <svg className="size-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              GitHub
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting || !!oauthLoading}
              onClick={() => handleOAuthLogin("google")}
              className="w-full text-xs normal-case tracking-normal cursor-pointer"
            >
              {oauthLoading === "google" ? (
                <Loader2 className="size-3.5 animate-spin mr-1.5" />
              ) : (
                <svg className="size-4 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              Google
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 py-4">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-foreground font-semibold underline underline-offset-4 hover:text-primary transition-colors"
            >
              Create Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
