import { createFileRoute } from "@tanstack/react-router";
import AdminDashboard from "@/screens/AdminDashboard";

export const Route = createFileRoute("/sultan-farouq-dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Not Found" },
      { name: "description", content: "Page not available." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});
