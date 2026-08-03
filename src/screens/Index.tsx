import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import TestimonialCard from "@/components/TestimonialCard";
import FAQSection from "@/components/FAQSection";
import CategoryCard from "@/components/CategoryCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import NewsletterSection from "@/components/NewsletterSection";
import FreeResourcesSection from "@/components/FreeResourcesSection";
import { useProducts, slugify } from "@/hooks/useProducts";
import heroImage from "@/assets/hero-digitalnest.jpg";
import heroLearning from "@/assets/hero-learning.jpg";
import heroTemplates from "@/assets/hero-templates.jpg";
import iconPdf from "@/assets/icon-pdf.png";
import iconCourse from "@/assets/icon-course.png";
import iconTemplate from "@/assets/icon-template.png";
import iconTools from "@/assets/icon-tools.png";

const heroSlides = [
  {
    image: heroImage,
    tagline: "Your one-stop digital shop",
    title: "Unlock Premium Digital Resources",
    highlight: "Instantly",
    description: "PDFs, Courses, Templates, and Tools for Creators & Professionals. Download and start learning in seconds.",
  },
  {
    image: heroLearning,
    tagline: "Learn at your own pace",
    title: "Master New Skills with Expert",
    highlight: "Courses",
    description: "Video courses, worksheets, and bundles designed by industry professionals to accelerate your growth.",
  },
  {
    image: heroTemplates,
    tagline: "Work smarter, not harder",
    title: "Professional Templates Ready to",
    highlight: "Use",
    description: "Save hours with our premium templates for documents, social media, spreadsheets, and more.",
  },
];

const categories = [
  { image: iconPdf, title: "PDFs", description: "Guides, Checklists, Workbooks", to: "/pdfs", count: 12 },
  { image: iconCourse, title: "Courses", description: "Video + PDF Bundles", to: "/courses", count: 8 },
  { image: iconTemplate, title: "Templates", description: "Docs, Spreadsheets, Social Media", to: "/templates", count: 15 },
  { image: iconTools, title: "Tools & Plugins", description: "Digital utilities for pros", to: "/pdfs", count: 5 },
];

const testimonials = [
  { quote: "Bought the marketing course bundle and it was worth every penny. Easy to follow and actually useful.", name: "David Mensah", role: "Digital Marketer", rating: 5 },
  { quote: "Instant download worked perfectly. Got my files within seconds of paying. Very smooth experience.", name: "Fatima Bello", role: "Freelancer", rating: 5 },
  { quote: "Good quality templates. I've bought from other sites before and DigitalNest is better value for money.", name: "Kevin Adeyemi", role: "Entrepreneur", rating: 4 },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % heroSlides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[current];

  return (
    <section className="relative overflow-hidden">
      <div className="container grid md:grid-cols-2 gap-8 md:gap-12 items-center py-12 md:py-16">
        <div className="space-y-5 animate-fade-in" key={current}>
          <span className="inline-block text-xs font-body font-semibold uppercase tracking-widest text-accent">
            {slide.tagline}
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            {slide.title} <span className="text-accent glow-orange-text">{slide.highlight}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed font-body">
            {slide.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-6 glow-orange-sm">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline" className="border-foreground/20">
              <Link to="/about">Start Learning</Link>
            </Button>
          </div>
        </div>
        <div className="relative animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <img
            key={slide.image}
            src={slide.image}
            alt="Premium digital products"
            className="rounded-xl shadow-xl w-full object-cover aspect-square"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <button
              onClick={() => setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length)}
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % heroSlides.length)}
              className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-accent w-6" : "bg-foreground/30"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { data: products, isLoading } = useProducts();
  const featured = products?.slice(0, 6) ?? [];

  return (
    <Layout>
      <HeroCarousel />

      {/* Categories */}
      <section className="bg-secondary py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center">Browse by Category</h2>
          <p className="text-muted-foreground text-center mt-2 font-body">Find exactly what you need</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {categories.map((cat) => (
              <CategoryCard key={cat.title} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">Featured Products</h2>
            <p className="text-muted-foreground mt-2 font-body">Our most loved digital resources</p>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border animate-pulse h-96" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 font-body">No products available yet. Check back soon!</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  image={p.image_url || "/placeholder.svg"}
                  title={p.name}
                  description={p.description || ""}
                  price={`$${Number(p.price).toFixed(0)}`}
                  oldPrice={p.old_price ? `$${Number(p.old_price).toFixed(0)}` : undefined}
                  priceNum={Number(p.price)}
                  category={p.category}
                  rating={5}
                  productType={p.product_type}
                  affiliateUrl={p.affiliate_url || undefined}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* Testimonials */}
      <section className="bg-secondary py-20">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-foreground text-center mb-12">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      <FreeResourcesSection />

      

      <FAQSection />

      {/* CTA */}
      <section className="bg-background py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--accent)/0.12)_0%,_transparent_70%)]" />
        <div className="container text-center space-y-5 relative z-10">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Ready to <span className="text-accent glow-orange-text">level up?</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Join thousands of creators who've already transformed their skills with our digital products.
          </p>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 glow-orange-sm">
            <Link to="/products">Get Started</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
