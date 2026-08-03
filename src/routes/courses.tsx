import { createFileRoute } from "@tanstack/react-router";
import ProductsPage from "@/screens/ProductsPage";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — DigitalNest" },
      { name: "description", content: "Learn new skills with our in-depth digital courses." },
      { property: "og:title", content: "Courses — DigitalNest" },
      { property: "og:description", content: "Learn new skills with our in-depth digital courses." },
    ],
  }),
  component: () => <ProductsPage defaultCategory="Course" title="Courses" subtitle="Learn new skills with our in-depth digital courses." />,
});
