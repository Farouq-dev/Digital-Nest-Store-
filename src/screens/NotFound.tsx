import { Link } from "@tanstack/react-router";
import { Compass, Home, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const suggestions = [
  { to: "/products", label: "All Products" },
  { to: "/courses", label: "Courses" },
  { to: "/templates", label: "Templates" },
  { to: "/pdfs", label: "PDFs" },
] as const;

const NotFound = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <Navbar />

    <main className="flex-1">
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-body uppercase tracking-wider text-muted-foreground">
            <Compass size={14} /> Error 404
          </span>

          <p className="font-display text-7xl md:text-8xl font-bold text-accent leading-none">404</p>

          <h1 className="font-display text-3xl md:text-4xl font-bold">Page not found</h1>

          <p className="text-muted-foreground leading-relaxed">
            The page you're looking for has moved, been renamed, or never existed.
            Let's get you back to something useful.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button asChild size="lg">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" /> Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                <Search className="w-4 h-4 mr-2" /> Browse Products
              </Link>
            </Button>
          </div>

          <div className="pt-10">
            <p className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-4">
              Popular sections
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {suggestions.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm hover:border-accent hover:text-accent transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default NotFound;
