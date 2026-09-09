import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, KeyRound, Loader2, Mail, MailCheck } from "lucide-react";

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

// Human-written Zod validation schema for forgot password
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const { resetPasswordForEmail } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setErrorMessage("");
      setIsSubmitting(true);

      await resetPasswordForEmail(data.email.trim());
      setSubmittedEmail(data.email.trim());
    } catch (err) {
      console.error("Password reset request failed:", err);
      setErrorMessage(
        err?.message || "Failed to send reset link. Please check the email and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // State after password reset link has been dispatched
  if (submittedEmail) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background antialiased">
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

        <Card className="relative w-full max-w-md border-border/70 shadow-2xl backdrop-blur-sm bg-card/95 text-center">
          <CardHeader className="space-y-3 pb-2">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <MailCheck className="size-7 text-emerald-400" />
            </div>
            <CardTitle className="text-xl tracking-wider uppercase font-semibold">
              Check Your Inbox
            </CardTitle>
            <CardDescription className="leading-relaxed">
              We have dispatched password reset instructions to{" "}
              <span className="font-semibold text-foreground">{submittedEmail}</span>.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click the link in the email to create a new password. If you don't see it within a few
              minutes, check your spam or junk folder.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/50">
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full cursor-pointer">
                <ArrowLeft className="size-4 mr-2" />
                Return to Sign In
              </Button>
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
            <KeyRound className="size-5 text-primary" />
          </div>
          <CardTitle className="text-xl tracking-wider uppercase font-semibold">
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your registered email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-2">
          {errorMessage && <AuthAlert type="error" message={errorMessage} />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor="reset-email" className="text-xs uppercase font-medium tracking-wider text-muted-foreground">
                Email Address
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  id="reset-email"
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 h-10 cursor-pointer transition-transform active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-border/50 py-4">
          <Link
            to="/"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
