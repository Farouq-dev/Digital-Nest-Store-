import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "@/screens/ProductsPage";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "All Products — DigitalNest" },
      { name: "description", content: "Browse our full collection of expertly crafted digital products." },
      { property: "og:title", content: "All Products — DigitalNest" },
      { property: "og:description", content: "Browse our full collection of expertly crafted digital products." },
    ],
  }),
  component: () => <ProductsPage defaultCategory="All" title="All Products" subtitle="Browse our full collection of expertly crafted digital products." />,
});
