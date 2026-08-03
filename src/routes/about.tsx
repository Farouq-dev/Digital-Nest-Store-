import { createFileRoute } from "@tanstack/react-router";
import Screen from "@/screens/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DigitalNest" },
      { name: "description", content: "The story behind DigitalNest and the products we build." },
      { property: "og:title", content: "About — DigitalNest" },
      { property: "og:description", content: "The story behind DigitalNest and the products we build." },
    ],
  }),
  component: Screen,
});
