import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";

type Category = "All" | "PDF" | "Course" | "Template" | "Tool";
type SortBy = "popular" | "price-low" | "price-high" | "newest";

const categories: Category[] = ["All", "PDF", "Course", "Template", "Tool"];

interface ProductsPageProps {
  defaultCategory?: Category;
  title?: string;
  subtitle?: string;
}

const ProductsPage = ({ defaultCategory = "All", title = "All Products", subtitle = "Browse our full collection of expertly crafted digital products." }: ProductsPageProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>(defaultCategory);
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const { data: products, isLoading } = useProducts();

  const filtered = (products ?? [])
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  return (
    <Layout>
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-3 font-body max-w-lg mx-auto">{subtitle}</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="text-sm font-body bg-secondary text-foreground border border-border rounded-md px-3 py-1.5"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border animate-pulse h-96" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No products found in this category yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  image={p.image_url || "/placeholder.svg"}
                  title={p.name}
                  description={p.description || ""}
                  price={`$${Number(p.price).toFixed(0)}`}
                  oldPrice={p.old_price ? `$${Number(p.old_price).toFixed(0)}` : undefined}
                  priceNum={Number(p.price)}
                  category={p.category}
                  rating={5}
                  productType={p.product_type}
                  affiliateUrl={p.affiliate_url || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductsPage;
