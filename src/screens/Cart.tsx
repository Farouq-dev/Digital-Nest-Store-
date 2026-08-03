import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

const CartItemRow = ({
  item,
  updateQuantity,
  removeItem,
  showQuantity = true,
}: {
  item: any;
  updateQuantity: (title: string, qty: number) => void;
  removeItem: (title: string) => void;
  showQuantity?: boolean;
}) => (
  <div className="flex gap-4 bg-card border border-border rounded-lg p-4 animate-fade-in">
    <img
      src={item.image}
      alt={item.title}
      className="w-20 h-20 object-cover rounded-md flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          {item.category && (
            <span className="text-xs font-body font-medium uppercase tracking-wider text-muted-foreground">
              {item.category}
            </span>
          )}
          <h3 className="font-display text-base font-semibold text-card-foreground truncate">
            {item.title}
          </h3>
        </div>
        <span className="font-display text-lg font-bold text-foreground whitespace-nowrap">
          ${item.priceNum * item.quantity}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3">
        {showQuantity ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.title, item.quantity - 1)}
              className="p-1 rounded-md bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="font-body text-sm font-medium w-6 text-center text-foreground">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.title, item.quantity + 1)}
              className="p-1 rounded-md bg-secondary text-foreground hover:bg-muted transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <div />
        )}
        <button
          onClick={() => removeItem(item.title)}
          className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container max-w-2xl text-center space-y-6">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground" />
            <h1 className="font-display text-3xl font-bold text-foreground">Your cart is empty</h1>
            <p className="text-muted-foreground font-body">Browse our collection and add some products to your cart.</p>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90 glow-orange-sm">
              <Link to="/products">Browse Products</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const myProducts = items.filter(i => i.productType !== "affiliate");
  const affiliateProducts = items.filter(i => i.productType === "affiliate");
  const myProductsTotal = myProducts.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);

  return (
    <Layout>
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-display text-3xl font-bold text-foreground">Your Cart</h1>
            <button
              onClick={clearCart}
              className="text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          </div>

          {/* My Products Section */}
          {myProducts.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <h2 className="font-display text-xl font-bold text-foreground">My Products</h2>
                <span className="text-sm text-muted-foreground font-body">— Pay once via PayPal</span>
              </div>
              <div className="space-y-4">
                {myProducts.map((item) => (
                  <CartItemRow
                    key={item.title}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeItem={removeItem}
                  />
                ))}
              </div>

              {/* My Products Summary */}
              <div className="mt-6 bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between font-body text-sm text-muted-foreground">
                  <span>Subtotal ({myProducts.length} item{myProducts.length > 1 ? "s" : ""})</span>
                  <span>${myProductsTotal}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="font-display text-lg font-bold text-foreground">Total</span>
                  <span className="font-display text-xl font-bold text-foreground">${myProductsTotal}</span>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 glow-orange-sm text-base py-5">
                  Checkout with PayPal — ${myProductsTotal}
                </Button>
              </div>
            </div>
          )}

          {/* External / Affiliate Products Section */}
          {affiliateProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <h2 className="font-display text-xl font-bold text-foreground">External Products</h2>
                <span className="text-sm text-muted-foreground font-body">— Purchase on partner sites</span>
              </div>
              <p className="text-sm text-muted-foreground font-body mb-4">
                These products are sold by our partners. Click "Buy Now" to be redirected to the seller's page.
              </p>
              <div className="space-y-4">
                {affiliateProducts.map((item) => (
                  <div key={item.title} className="bg-card border border-border rounded-lg p-4 animate-fade-in">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {item.category && (
                              <span className="text-xs font-body font-medium uppercase tracking-wider text-muted-foreground">
                                {item.category}
                              </span>
                            )}
                            <h3 className="font-display text-base font-semibold text-card-foreground truncate">
                              {item.title}
                            </h3>
                          </div>
                          <span className="font-display text-lg font-bold text-foreground whitespace-nowrap">
                            ${item.priceNum}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <Button
                            size="sm"
                            className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                            onClick={() => {
                              if (item.affiliateUrl) {
                                window.open(item.affiliateUrl, "_blank", "noopener,noreferrer");
                              }
                            }}
                          >
                            <ExternalLink size={14} />
                            Buy Now
                          </Button>
                          <button
                            onClick={() => removeItem(item.title)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
