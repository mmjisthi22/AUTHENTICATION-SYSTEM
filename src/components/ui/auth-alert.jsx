import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Human-written alert banner for displaying authentication notices, errors, and success states.
 */
export function AuthAlert({ type = "error", message, className }) {
  if (!message) return null;

  const isError = type === "error";
  const isSuccess = type === "success";

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-md border p-3 text-xs leading-relaxed transition-all animate-in fade-in duration-200",
        isError && "border-destructive/40 bg-destructive/10 text-destructive dark:bg-destructive/15",
        isSuccess && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 dark:bg-emerald-950/30",
        !isError && !isSuccess && "border-primary/30 bg-primary/10 text-foreground",
        className
      )}
    >
      {isError && <AlertCircle className="size-4 shrink-0 mt-0.5" />}
      {isSuccess && <CheckCircle2 className="size-4 shrink-0 mt-0.5 text-emerald-400" />}
      {!isError && !isSuccess && <Info className="size-4 shrink-0 mt-0.5 text-primary" />}
      <span className="flex-1 font-medium">{message}</span>
    </div>
  );
}
