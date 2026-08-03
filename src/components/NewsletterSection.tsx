import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("You're in! 🎉 Check your inbox for free templates & guides.");
      setEmail("");
    }
  };

  return (
    <section className="bg-accent/10 py-16">
      <div className="container max-w-xl text-center">
        <h2 className="font-display text-3xl font-bold text-foreground">Get Free Templates & Guides</h2>
        <p className="text-muted-foreground mt-2 font-body">
          Join 10,000+ creators and professionals. Get our best resources delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-3 mt-6 max-w-md mx-auto">
          <Input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            maxLength={255}
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            Subscribe
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default NewsletterSection;
