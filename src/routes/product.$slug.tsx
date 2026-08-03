import { createFileRoute } from "@tanstack/react-router";
import ProductDetail from "@/screens/ProductDetail";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({
    meta: [
      { title: "Product — DigitalNest" },
      { name: "description", content: "Product details, preview images and pricing on DigitalNest." },
      { property: "og:title", content: "Product — DigitalNest" },
      { property: "og:description", content: "Product details, preview images and pricing on DigitalNest." },
    ],
  }),
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  return <ProductDetail slug={slug} />;
}
