import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, FileText, Layout } from "lucide-react";
import { toast } from "sonner";

const freebies = [
  { icon: FileText, title: "Social Media Checklist", description: "A step-by-step checklist to grow your online presence" },
  { icon: Layout, title: "Business Plan Template", description: "Professional template to outline your business strategy" },
  { icon: Download, title: "Content Calendar Guide", description: "Plan and organize your content like a pro" },
];

const FreeResourcesSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Check your inbox! Your free resources are on the way 🎉");
    setEmail("");
  };

  return (
    <section className="bg-secondary py-20">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-body font-semibold uppercase tracking-widest text-accent mb-2">
            Free Resources
          </span>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Get Free Templates & <span className="text-accent glow-orange-text">Guides</span>
          </h2>
          <p className="text-muted-foreground mt-2 font-body max-w-md mx-auto">
            Enter your email and instantly receive our most popular starter resources — completely free.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {freebies.map((item) => (
            <div
              key={item.title}
              className="bg-card border border-border rounded-lg p-6 flex items-start gap-4 hover:border-accent/40 transition-colors"
            >
              <div className="p-2 rounded-md bg-accent/10 text-accent shrink-0">
                <item.icon size={22} />
              </div>
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 bg-card border-border"
          />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90 glow-orange-sm">
            Get Free Access
          </Button>
        </form>
      </div>
    </section>
  );
};

export default FreeResourcesSection;
