import { Card, CardContent } from "@/components/ui/card";
import { Package, Eye, ShoppingBag, DollarSign } from "lucide-react";

interface StatsCardsProps {
  totalProducts: number;
  totalVisitors: number;
  totalSales: number;
  totalRevenue: number;
}

const StatsCards = ({ totalProducts, totalVisitors, totalSales, totalRevenue }: StatsCardsProps) => {
  const stats = [
    { label: "Total Products", value: totalProducts, icon: Package, color: "text-accent" },
    { label: "Total Visitors", value: totalVisitors.toLocaleString(), icon: Eye, color: "text-blue-500" },
    { label: "Products Sold", value: totalSales, icon: ShoppingBag, color: "text-green-500" },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-yellow-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label} className="border-border bg-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-muted ${s.color}`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
