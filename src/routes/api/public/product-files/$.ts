import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/product-files/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });
        const { signAssetUrl } = await import("@/lib/admin.server");
        const url = await signAssetUrl(path);
        if (!url) return new Response("Not found", { status: 404 });
        return new Response(null, { status: 302, headers: { location: url } });
      },
    },
  },
});
