import { Zap, Shield, Download, Heart } from "lucide-react";

const items = [
  { icon: Download, title: "Instant Downloads", desc: "Get your products immediately after purchase — no waiting." },
  { icon: Shield, title: "Premium Quality", desc: "Every resource is expert-crafted and thoroughly reviewed." },
  { icon: Zap, title: "Affordable Pricing", desc: "Professional-grade content at prices that won't break the bank." },
  { icon: Heart, title: "Curated for You", desc: "Hand-picked resources tailored for creators and professionals." },
];

const WhyChooseUs = () => (
  <section className="py-20">
    <div className="container">
      <h2 className="font-display text-3xl font-bold text-foreground text-center">Why Choose DigitalNest?</h2>
      <p className="text-muted-foreground text-center mt-2 font-body">Everything you need, nothing you don't.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="text-center space-y-3 animate-fade-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent">
              <Icon size={24} />
            </div>
            <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
