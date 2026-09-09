import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";

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
import { AuthAlert } from "@/components/ui/auth-alert";

// Human-written Zod validation schema for updating password
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[0-9]/, "Must include at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

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

      await updatePassword(data.password);
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to update password:", err);
      setErrorMessage(
        err?.message || "Failed to update password. Your recovery link may have expired."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background antialiased">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

        <Card className="relative w-full max-w-md border-border/70 shadow-2xl backdrop-blur-sm bg-card/95 text-center">
          <CardHeader className="space-y-3 pb-2">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <CheckCircle2 className="size-7 text-emerald-400" />
            </div>
            <CardTitle className="text-xl tracking-wider uppercase font-semibold">
              Password Updated
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Your password has been changed successfully. You can now access your account with
              your new credentials.
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex flex-col gap-2 pt-4 border-t border-border/50">
            <Button
              onClick={() => navigate("/dashboard", { replace: true })}
              className="w-full cursor-pointer"
            >
              Continue to Dashboard
            </Button>
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
            <KeyRound className="size-5 text-primary" />
          </div>
          <CardTitle className="text-xl tracking-wider uppercase font-semibold">
            Create New Password
          </CardTitle>
          <CardDescription>
            Enter a strong new password for your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {errorMessage && <AuthAlert type="error" message={errorMessage} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="new-password" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                New Password
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="new-password"
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
                    <span>Must be 8+ chars, uppercase & number</span>
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

            {/* Confirm New Password */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="confirm-new-password" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Confirm New Password
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="confirm-new-password"
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 h-10 cursor-pointer transition-transform active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 py-4">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
