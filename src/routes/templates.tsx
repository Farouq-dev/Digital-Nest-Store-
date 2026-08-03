import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "@/screens/ProductsPage";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — DigitalNest" },
      { name: "description", content: "Ready-to-use templates to speed up your work." },
      { property: "og:title", content: "Templates — DigitalNest" },
      { property: "og:description", content: "Ready-to-use templates to speed up your work." },
    ],
  }),
  component: () => <ProductsPage defaultCategory="Template" title="Templates" subtitle="Ready-to-use templates to speed up your work." />,
});
