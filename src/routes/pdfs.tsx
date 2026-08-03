import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "@/screens/ProductsPage";

export const Route = createFileRoute("/pdfs")({
  head: () => ({
    meta: [
      { title: "PDF Guides — DigitalNest" },
      { name: "description", content: "Practical PDF guides and ebooks you can read today." },
      { property: "og:title", content: "PDF Guides — DigitalNest" },
      { property: "og:description", content: "Practical PDF guides and ebooks you can read today." },
    ],
  }),
  component: () => <ProductsPage defaultCategory="PDF" title="PDF Guides" subtitle="Practical PDF guides and ebooks you can read today." />,
});
