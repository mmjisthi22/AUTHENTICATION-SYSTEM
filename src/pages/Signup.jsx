import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, MailCheck, UserPlus, User, Mail } from "lucide-react";

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

// Human-written Zod validation schema for sign-up
const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(2, "Full name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email address is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Signup() {
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [confirmationSentTo, setConfirmationSentTo] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  // Calculate password strength score (0-4)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = getPasswordStrength(passwordValue);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "bg-destructive",
    "bg-amber-500",
    "bg-sky-500",
    "bg-emerald-500",
  ];

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      setIsSubmitting(true);

      const result = await signUp({
        email: data.email.trim(),
        password: data.password,
        fullName: data.fullName.trim(),
      });

      // If user session is not created immediately, Supabase email confirmation is enabled
      if (result?.user && !result?.session) {
        setConfirmationSentTo(data.email.trim());
      } else {
        // Direct session established -> redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Sign up failed:", err);
      if (err?.message?.toLowerCase().includes("user already registered")) {
        setErrorMessage(
          "An account with this email address already exists. Please sign in instead."
        );
      } else {
        setErrorMessage(err?.message || "Failed to create account. Please try again.");
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

  // If email confirmation is required by Supabase
  if (confirmationSentTo) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background antialiased">
        <Card className="w-full max-w-md border-border/70 shadow-2xl backdrop-blur-sm bg-card/95 text-center">
          <CardHeader className="space-y-3 pb-2">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <MailCheck className="size-7 text-emerald-400" />
            </div>
            <CardTitle className="text-xl tracking-wider uppercase font-semibold">
              Check Your Inbox
            </CardTitle>
            <CardDescription className="leading-relaxed">
              We have sent a verification link to{" "}
              <span className="font-semibold text-foreground">{confirmationSentTo}</span>.
              Please verify your email address to activate your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <p className="text-xs text-muted-foreground">
              Didn't receive the email? Check your spam folder or try signing in to resend.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <Link to="/" className="w-full">
              <Button className="w-full cursor-pointer">Proceed to Sign In</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background antialiased">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <Card className="relative w-full max-w-md border-border/70 shadow-2xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border bg-secondary/40">
            <UserPlus className="size-5 text-primary" />
          </div>
          <CardTitle className="text-xl tracking-wider uppercase font-semibold">
            Create Account
          </CardTitle>
          <CardDescription>
            Join our platform and start building today.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {errorMessage && <AuthAlert type="error" message={errorMessage} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="signup-name" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Full Name
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Jane Doe"
                  className="px-2"
                  disabled={isSubmitting}
                  {...register("fullName")}
                />
                <User className="size-4 text-muted-foreground/60 absolute right-2 pointer-events-none" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-destructive font-medium mt-0.5">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="signup-email" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Email Address
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="signup-email"
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
              <FieldLabel htmlFor="signup-password" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Password
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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

              {/* Dynamic Password Strength Indicator */}
              {passwordValue && (
                <div className="mt-1 space-y-1">
                  <div className="flex gap-1 h-1 w-full bg-secondary/50 rounded-full overflow-hidden">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-all duration-300 ${
                          strengthScore >= step
                            ? strengthColors[strengthScore - 1]
                            : "bg-transparent"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground flex justify-between">
                    <span>Must be 8+ chars, with an uppercase & number</span>
                    <span className="font-medium text-foreground">
                      {strengthLabels[strengthScore - 1] || "Too weak"}
                    </span>
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-destructive font-medium mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="signup-confirm-password" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Confirm Password
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="px-2 pr-9"
                  disabled={isSubmitting}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 p-1 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium mt-0.5">
                  {errors.confirmPassword.message}
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
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Social Sign Up Divider */}
          <div className="relative my-3">
            <Separator className="my-2" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-2 text-[10px] uppercase tracking-widest text-muted-foreground">
              Or sign up with
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
            Already have an account?{" "}
            <Link
              to="/"
              className="text-foreground font-semibold underline underline-offset-4 hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
