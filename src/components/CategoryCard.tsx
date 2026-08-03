import { Link, type LinkProps } from "@tanstack/react-router";

interface CategoryCardProps {
  image: string;
  title: string;
  description: string;
  to: LinkProps["to"];
  count: number;
}

const CategoryCard = ({ image, title, description, to, count }: CategoryCardProps) => (
  <Link
    to={to}
    className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-accent/30 p-6 flex flex-col items-center text-center"
  >
    <img src={image} alt={title} className="w-16 h-16 object-contain mb-4 transition-transform duration-300 group-hover:scale-110" />
    <h3 className="font-display text-lg font-semibold text-card-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1">{description}</p>
    <span className="mt-3 text-xs font-body font-medium text-accent">{count} products →</span>
  </Link>
);

export default CategoryCard;
