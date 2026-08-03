import { createFileRoute } from "@tanstack/react-router";
import Index from "@/screens/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DigitalNest — Premium Digital Products, Courses & Templates" },
      { name: "description", content: "Shop expertly crafted PDFs, courses, templates and tools from DigitalNest." },
      { property: "og:title", content: "DigitalNest — Premium Digital Products" },
      { property: "og:description", content: "Shop expertly crafted PDFs, courses, templates and tools from DigitalNest." },
    ],
  }),
  component: Index,
});
