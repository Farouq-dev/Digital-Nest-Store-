import { createFileRoute } from "@tanstack/react-router";
import Screen from "@/screens/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DigitalNest" },
      { name: "description", content: "Get in touch with the DigitalNest team." },
      { property: "og:title", content: "Contact — DigitalNest" },
      { property: "og:description", content: "Get in touch with the DigitalNest team." },
    ],
  }),
  component: Screen,
});
