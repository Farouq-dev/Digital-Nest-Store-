import { createFileRoute } from "@tanstack/react-router";
import Screen from "@/screens/Cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — DigitalNest" },
      { name: "description", content: "Review the digital products in your cart before checkout." },
      { property: "og:title", content: "Your Cart — DigitalNest" },
      { property: "og:description", content: "Review the digital products in your cart before checkout." },
    ],
  }),
  component: Screen,
});
