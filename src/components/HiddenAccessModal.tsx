import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  const [busy, setBusy] = useState(false);
  const { locked, registerFailure } = useAdminLockout();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setBusy(true);
    try {
      const { ok } = await adminUnlock({ data: { password } });
      if (ok) {
        onOpenChange(false);
        await navigate({ to: "/sultan-farouq-dashboard" });
      } else {
        toast.error(registerFailure());
      }
    } catch {
      toast.error("Something went wrong");
    }
    setPassword("");
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm" aria-label="Sign in">
        {locked ? (
          <p className="py-4 text-center font-body text-sm text-muted-foreground">
            {LOCKED_MESSAGE}
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4 pt-2">
            <Input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
            />
            <Button type="submit" className="w-full" disabled={busy || !password}>
              {busy ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HiddenAccessModal;
