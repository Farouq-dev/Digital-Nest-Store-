import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const TOS_KEY = "digitalnest_tos_accepted";

const TermsOfServiceModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(TOS_KEY);
    if (!accepted) {
      setOpen(true);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem(TOS_KEY, "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-lg max-h-[80vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground font-body leading-relaxed py-2">
          <p>
            Welcome to Digital Nest. By accessing our store and purchasing products, you agree to the following terms:
          </p>
          <ul className="list-disc pl-5 space-y-3">
            <li>All products are digital and delivered electronically.</li>
            <li>
              You may use purchased products for personal or business use, but reselling, distributing, or sharing products without permission is prohibited.
            </li>
            <li>
              Digital Nest reserves the right to modify products, prices, or policies at any time.
            </li>
            <li>
              We are not responsible for any damages or losses resulting from the use of products purchased from our store.
            </li>
            <li>
              You agree to comply with all applicable laws while using Digital Nest products.
            </li>
          </ul>
          <p>Thank you for visiting Digital Nest!</p>
        </div>
        <DialogFooter>
          <Button onClick={handleAgree} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfServiceModal;
