import { createFileRoute } from "@tanstack/react-router";
import Screen from "@/screens/Signup";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — DigitalNest" },
      { name: "description", content: "Create a DigitalNest account to buy and download products." },
      { property: "og:title", content: "Create Account — DigitalNest" },
      { property: "og:description", content: "Create a DigitalNest account to buy and download products." },
    ],
  }),
  component: Screen,
});
