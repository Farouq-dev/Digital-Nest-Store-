import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare } from "lucide-react";

const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent! We'll get back to you soon.");
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground">Get in Touch</h1>
            <p className="text-muted-foreground mt-3 font-body">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-lg p-8">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Name</label>
                <Input required placeholder="Your name" maxLength={100} />
              </div>
              <div>
                <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Email</label>
                <Input required type="email" placeholder="you@example.com" maxLength={255} />
              </div>
            </div>
            <div>
              <label className="text-sm font-body font-medium text-foreground mb-1.5 block">Message</label>
              <Textarea required placeholder="How can we help?" rows={5} maxLength={1000} />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-accent mt-0.5" />
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">Email Us</h3>
                <p className="text-sm text-muted-foreground">hello@digishelf.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare size={20} className="text-accent mt-0.5" />
              <div>
                <h3 className="font-body text-sm font-semibold text-foreground">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Available Mon–Fri, 9am–5pm</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
