import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminUnlock } from "@/lib/admin.functions";
import { LOCKED_MESSAGE, useAdminLockout } from "@/hooks/useAdminLockout";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Unbranded password-only modal. Reached only through the hidden footer trigger. */
const HiddenAccessModal = ({ open, onOpenChange }: Props) => {
  const [password, setPassword] = useState("");
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { locked, registerFailure, reset } = useAdminLockout();
  const navigate = useNavigate();

  // Reset only transient field state when the modal closes; the attempt
  // counter lives in the lockout hook and persists.
  useEffect(() => {
    if (!open) {
      setPassword("");
      setReveal(false);
      setError(null);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked || busy) return;
    const candidate = password.trim();
    if (!candidate) return; // empty submissions never count as an attempt
    setBusy(true);
    setError(null);
    try {
      const { ok } = await adminUnlock({ data: { password: candidate } });
      if (ok) {
        reset();
        setPassword("");
        onOpenChange(false);
        await navigate({ to: "/sultan-farouq-dashboard" });
        return;
      }
      const message = registerFailure();
      setError(message);
      toast.error(message);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setPassword("");
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-sm sm:max-w-sm">
        <DialogTitle className="sr-only">Sign in</DialogTitle>
        {locked ? (
          <p className="py-4 text-center font-body text-sm text-muted-foreground">
            {LOCKED_MESSAGE}
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4 pt-2" noValidate>
            <div className="relative">
              <Input
                type={reveal ? "text" : "password"}
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-label="Password"
                aria-invalid={error ? true : undefined}
                disabled={busy}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setReveal((v) => !v)}
                aria-label={reveal ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                {reveal ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <p
              aria-live="polite"
              className="min-h-[1rem] font-body text-xs text-destructive"
            >
              {error}
            </p>

            <Button type="submit" className="w-full" disabled={busy || !password.trim()}>
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HiddenAccessModal;
