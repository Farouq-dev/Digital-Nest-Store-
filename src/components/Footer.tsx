import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import HiddenAccessModal from "./HiddenAccessModal";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/templates", label: "Templates" },
  { to: "/pdfs", label: "PDFs" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter/X" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

const DOUBLE_TAP_MS = 400;

const Footer = () => {
  const [accessOpen, setAccessOpen] = useState(false);
  const lastTap = useRef(0);

  // Mobile browsers don't fire dblclick reliably on text nodes, so detect a
  // double tap manually. Single taps/clicks intentionally do nothing.
  const handleTouchEnd = () => {
    const now = Date.now();
    if (now - lastTap.current < DOUBLE_TAP_MS) {
      lastTap.current = 0;
      setAccessOpen(true);
    } else {
      lastTap.current = now;
    }
  };


  return (

  <footer className="border-t border-border bg-primary relative overflow-hidden">
    <div className="pointer-events-none absolute inset-0 animate-[orange-glow-pulse_3s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_center,_hsl(30_80%_55%/0.35)_0%,_hsl(30_80%_55%/0.1)_40%,_transparent_70%)]" />
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left — Logo & tagline */}
        <div className="space-y-3">
          <h3 className="font-display text-xl font-bold text-primary-foreground">
            Digital<span className="text-accent">Nest</span>
          </h3>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Your one-stop digital shop
          </p>
        </div>

        {/* Middle — Quick Links */}
        <div>
          <h4 className="font-body text-xs font-semibold text-primary-foreground/80 mb-4 uppercase tracking-wider">
            Quick Links
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-primary-foreground/50 hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — Contact & Socials */}
        <div className="space-y-4">
          <h4 className="font-body text-xs font-semibold text-primary-foreground/80 mb-4 uppercase tracking-wider">
            Get in Touch
          </h4>
          <a
            href="mailto:hello@digitalnest.com"
            className="flex items-center gap-2 text-sm text-primary-foreground/50 hover:text-accent transition-colors"
          >
            <Mail size={16} />
            hello@digitalnest.com
          </a>
          <div className="flex gap-4 mt-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-full border border-primary-foreground/10 text-primary-foreground/50 hover:text-accent hover:border-accent transition-colors"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-primary-foreground/10">
      <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/30">
        <p onDoubleClick={() => setAccessOpen(true)} className="select-none">
          © DigitalNest Store 2026
        </p>
        <div className="flex gap-4">
          <Link to="/contact" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <Link to="/contact" className="hover:text-accent transition-colors">Refund Policy</Link>
        </div>
      </div>
    </div>

    <HiddenAccessModal open={accessOpen} onOpenChange={setAccessOpen} />
  </footer>
  );
};


export default Footer;
