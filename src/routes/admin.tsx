import { createFileRoute, notFound } from "@tanstack/react-router";
import NotFound from "@/screens/NotFound";

// The old /admin path no longer exists: it renders the site 404 page.
export const Route = createFileRoute("/admin")({
  loader: () => {
    throw notFound();
  },
  head: () => ({
    meta: [
      { title: "404 — Page Not Found" },
      { name: "description", content: "The page you're looking for doesn't exist." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  notFoundComponent: NotFound,
  errorComponent: NotFound,
  component: NotFound,
});
