import { Star } from "lucide-react";

const TestimonialCard = ({ quote, name, role, rating = 5 }: { quote: string; name: string; role: string; rating?: number }) => (
  <div className="bg-card border border-border rounded-lg p-6 space-y-4">
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? "fill-accent text-accent" : "text-border"}
        />
      ))}
    </div>
    <p className="text-sm text-muted-foreground italic leading-relaxed">"{quote}"</p>
    <div>
      <p className="font-body text-sm font-semibold text-foreground">{name}</p>
      <p className="text-xs text-muted-foreground">{role}</p>
    </div>
  </div>
);

export default TestimonialCard;
