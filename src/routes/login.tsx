import { createFileRoute } from "@tanstack/react-router";
import Screen from "@/screens/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — DigitalNest" },
      { name: "description", content: "Sign in to your DigitalNest account." },
      { property: "og:title", content: "Sign In — DigitalNest" },
      { property: "og:description", content: "Sign in to your DigitalNest account." },
    ],
  }),
  component: Screen,
});
