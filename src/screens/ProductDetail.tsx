import { useState } from "react";
import { Link } from "@tanstack/react-router";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useProductBySlug } from "@/hooks/useProducts";

const ProductDetail = ({ slug }: { slug: string }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { product, isLoading } = useProductBySlug(slug);

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-muted rounded-xl animate-pulse aspect-[3/4]" />
            <div className="space-y-4">
              <div className="h-6 bg-muted rounded animate-pulse w-1/3" />
              <div className="h-10 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center space-y-4">
          <h1 className="font-display text-3xl font-bold text-foreground">Product Not Found</h1>
          <p className="text-muted-foreground font-body">The product you're looking for doesn't exist.</p>
          <Button asChild variant="outline">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const allImages = [product.image_url, product.image_url_2, product.image_url_3].filter(Boolean) as string[];
  const imageSrc = allImages[0] || "/placeholder.svg";
  const isAffiliate = product.product_type === "affiliate";

  const handleAddToCart = () => {
    addItem({
      image: imageSrc,
      title: product.name,
      description: product.description || "",
      price: `$${Number(product.price).toFixed(0)}`,
      priceNum: Number(product.price),
      category: product.category,
      productType: product.product_type,
      affiliateUrl: product.affiliate_url || undefined,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (product.affiliate_url) {
      window.open(product.affiliate_url, "_blank", "noopener,noreferrer");
    }
  };

  const paragraphs = (product.description || "").split("\n").filter(Boolean);

  return (
    <Layout>
      <section className="py-12 md:py-20">
        <div className="container">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-body"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                <img
                  src={allImages[selectedImage] || imageSrc}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground text-sm px-3 py-1">
                  {product.category}
                </Badge>
                {isAffiliate && (
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground text-sm px-3 py-1">
                    External Product
                  </Badge>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? "border-accent" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-body font-semibold uppercase tracking-widest text-accent">
                  {product.category}
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground font-body">(5.0)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-display text-4xl font-bold text-foreground">
                  ${Number(product.price).toFixed(2)}
                </p>
                {product.old_price && (
                  <p className="font-display text-2xl text-muted-foreground line-through">
                    ${Number(product.old_price).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {paragraphs.length > 0 ? (
                  paragraphs.map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed font-body">{p}</p>
                  ))
                ) : (
                  <p className="text-muted-foreground leading-relaxed font-body">
                    A premium digital product to help you grow and succeed.
                  </p>
                )}
              </div>

              {/* Benefits */}
              <div className="space-y-3 pt-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  What You'll Get
                </h3>
                <ul className="space-y-2.5">
                  {(isAffiliate
                    ? [
                        "Redirected to the seller's page to complete purchase",
                        "Product delivered by the external seller",
                        "Support provided by the product creator",
                      ]
                    : [
                        "Instant digital download after purchase",
                        "Lifetime access with free updates",
                        "Professional quality content",
                        "30-day money-back guarantee",
                      ]
                  ).map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-body">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 pt-4">
                {isAffiliate ? (
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 glow-orange-sm px-8"
                    onClick={handleBuyNow}
                  >
                    <ExternalLink size={18} />
                    Buy Now — External Site
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 glow-orange-sm px-8"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart — ${Number(product.price).toFixed(0)}
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground font-body">
                {isAffiliate ? (
                  <>
                    <span>↗ External purchase</span>
                    <span>✓ Trusted partner</span>
                  </>
                ) : (
                  <>
                    <span>✓ Instant download</span>
                    <span>✓ Lifetime access</span>
                    <span>✓ Free updates</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
