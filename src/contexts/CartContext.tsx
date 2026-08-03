import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CartItem {
  image: string;
  title: string;
  description: string;
  price: string;
  priceNum: number;
  category?: string;
  quantity: number;
  productId?: string;
  productType?: string;
  affiliateUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (title: string) => void;
  updateQuantity: (title: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const GUEST_CART_KEY = "digitalnest_guest_cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadGuestCart = useCallback((): CartItem[] => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const saveGuestCart = useCallback((cartItems: CartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
  }, []);

  const getOrCreateCart = useCallback(async (userId: string): Promise<string | null> => {
    const { data: existing } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) return existing.id;

    const { data: created } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select("id")
      .single();

    return created?.id ?? null;
  }, []);

  const loadDbCart = useCallback(async (cId: string): Promise<CartItem[]> => {
    const { data } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("cart_id", cId);

    if (!data) return [];

    return data.map((item: any) => ({
      productId: item.product_id,
      image: item.products?.image_url || "/placeholder.svg",
      title: item.products?.name || "",
      description: item.products?.description || "",
      price: `$${Number(item.products?.price || 0).toFixed(0)}`,
      priceNum: Number(item.products?.price || 0),
      category: item.products?.category,
      quantity: item.quantity,
      productType: item.products?.product_type || "my_product",
      affiliateUrl: item.products?.affiliate_url || null,
    }));
  }, []);

  const syncToDb = useCallback(async (cId: string, cartItems: CartItem[]) => {
    await supabase.from("cart_items").delete().eq("cart_id", cId);

    if (cartItems.length === 0) return;

    const { data: products } = await supabase
      .from("products")
      .select("id, name")
      .in("name", cartItems.map(i => i.title));

    if (!products) return;

    const productMap = new Map(products.map(p => [p.name, p.id]));

    const inserts = cartItems
      .filter(i => productMap.has(i.title))
      .map(i => ({
        cart_id: cId,
        product_id: productMap.get(i.title)!,
        quantity: i.quantity,
      }));

    if (inserts.length > 0) {
      await supabase.from("cart_items").insert(inserts);
    }
  }, []);

  const mergeGuestCart = useCallback(async (cId: string) => {
    const guestItems = loadGuestCart();
    if (guestItems.length === 0) return;

    const dbItems = await loadDbCart(cId);

    const merged = [...dbItems];
    for (const guest of guestItems) {
      const existing = merged.find(m => m.title === guest.title);
      if (existing) {
        existing.quantity += guest.quantity;
      } else {
        merged.push(guest);
      }
    }

    await syncToDb(cId, merged);
    localStorage.removeItem(GUEST_CART_KEY);
    return merged;
  }, [loadGuestCart, loadDbCart, syncToDb]);

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        setLoading(true);
        try {
          const cId = await getOrCreateCart(user.id);
          setCartId(cId);
          if (cId) {
            const merged = await mergeGuestCart(cId);
            if (merged) {
              setItems(merged);
            } else {
              const dbItems = await loadDbCart(cId);
              setItems(dbItems);
            }
          }
        } catch (err) {
          console.error("Failed to load cart:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setCartId(null);
        setItems(loadGuestCart());
      }
    };
    loadCart();
  }, [user, getOrCreateCart, mergeGuestCart, loadDbCart, loadGuestCart]);

  const updateItems = useCallback((updater: (prev: CartItem[]) => CartItem[]) => {
    setItems(prev => {
      const next = updater(prev);
      if (user && cartId) {
        syncToDb(cartId, next);
      } else {
        saveGuestCart(next);
      }
      return next;
    });
  }, [user, cartId, syncToDb, saveGuestCart]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    updateItems(prev => {
      const existing = prev.find(i => i.title === item.title);
      if (existing) {
        return prev.map(i => i.title === item.title ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, [updateItems]);

  const removeItem = useCallback((title: string) => {
    updateItems(prev => prev.filter(i => i.title !== title));
  }, [updateItems]);

  const updateQuantity = useCallback((title: string, quantity: number) => {
    if (quantity <= 0) {
      updateItems(prev => prev.filter(i => i.title !== title));
    } else {
      updateItems(prev => prev.map(i => i.title === title ? { ...i, quantity } : i));
    }
  }, [updateItems]);

  const clearCart = useCallback(() => {
    updateItems(() => []);
  }, [updateItems]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.priceNum * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
