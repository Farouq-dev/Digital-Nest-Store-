import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Package } from "lucide-react";
import StatsCards from "@/components/dashboard/StatsCards";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import ProductDialog, { type ProductForm } from "@/components/dashboard/ProductDialog";
import ProductTable from "@/components/dashboard/ProductTable";
import {
  adminAnalytics,
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminLock,
  adminStatus,
  adminUnlock,
  adminUpdateProduct,
} from "@/lib/admin.functions";
import { LOCKED_MESSAGE, useAdminLockout } from "@/hooks/useAdminLockout";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  file_url: string | null;
  category: string;
  created_at: string;
  product_type: string;
  affiliate_url: string | null;
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  old_price: "",
  category: "PDF",
  image_url: "",
  image_url_2: "",
  image_url_3: "",
  file_url: "",
  product_type: "my_product",
  affiliate_url: "",
};

/** Unbranded gate. Nothing here reveals that an admin panel exists. */
function AccessGate({ onUnlocked }: { onUnlocked: () => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { locked, registerFailure } = useAdminLockout();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    setBusy(true);
    try {
      const { ok } = await adminUnlock({ data: { password } });
      if (ok) onUnlocked();
      else toast.error(registerFailure());
    } catch {
      toast.error("Something went wrong");
    }
    setPassword("");
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {locked ? (
        <p className="max-w-xs text-center font-body text-sm text-muted-foreground">
          {LOCKED_MESSAGE}
        </p>
      ) : (
        <form onSubmit={submit} className="w-full max-w-xs space-y-3">
          <Input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Password"
          />
          <Button type="submit" className="w-full" disabled={busy || !password}>
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      )}
    </div>
  );
}

function DashboardPanel({ onLock }: { onLock: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [visitorData, setVisitorData] = useState<{ date: string; visitors: number }[]>([]);
  const [salesData, setSalesData] = useState<{ date: string; sales: number; revenue: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  const refresh = useCallback(async () => {
    try {
      const rows = await adminListProducts();
      setProducts(rows as Product[]);
    } catch {
      onLock();
      return;
    }
    try {
      const a = await adminAnalytics();
      setTotalVisitors(a.totalVisitors);
      setTotalSales(a.totalSales);
      setTotalRevenue(a.totalRevenue);
      setVisitorData(a.visitorData);
      setSalesData(a.salesData);
      setCategoryData(a.categoryData);
    } catch {
      /* analytics can fail silently */
    }
  }, [onLock]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (form.product_type === "affiliate" && !form.affiliate_url) {
      toast.error("Affiliate URL is required for affiliate products");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      old_price: form.old_price ? parseFloat(form.old_price) : null,
      category: form.category,
      image_url: form.image_url || null,
      image_url_2: form.image_url_2 || null,
      image_url_3: form.image_url_3 || null,
      file_url: form.product_type === "my_product" ? form.file_url || null : null,
      product_type: form.product_type,
      affiliate_url: form.product_type === "affiliate" ? form.affiliate_url || null : null,
    };
    try {
      if (editingId) await adminUpdateProduct({ data: { id: editingId, ...payload } });
      else await adminCreateProduct({ data: payload });
      toast.success(editingId ? "Product updated" : "Product created");
      setDialogOpen(false);
      resetForm();
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await adminDeleteProduct({ data: { id } });
      toast.success("Deleted");
      setDeleteConfirmId(null);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: String(p.price),
      old_price: p.old_price ? String(p.old_price) : "",
      category: p.category,
      image_url: p.image_url || "",
      image_url_2: p.image_url_2 || "",
      image_url_3: p.image_url_3 || "",
      file_url: p.file_url || "",
      product_type: p.product_type === "affiliate" ? "affiliate" : "my_product",
      affiliate_url: p.affiliate_url || "",
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-accent" />
            <span className="font-display text-lg font-bold">
              Digital<span className="text-accent">Nest</span> Admin
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await adminLock();
              onLock();
            }}
          >
            <LogOut className="w-4 h-4 mr-1" /> Sign out
          </Button>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>

        <StatsCards
          totalProducts={products.length}
          totalVisitors={totalVisitors}
          totalSales={totalSales}
          totalRevenue={totalRevenue}
        />

        <AnalyticsCharts
          visitorData={visitorData}
          salesData={salesData}
          categoryData={categoryData}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold">Products</h2>
          <ProductDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            form={form}
            setForm={setForm}
            editingId={editingId}
            saving={saving}
            onSave={handleSave}
            onReset={resetForm}
          />
        </div>

        <ProductTable
          products={products}
          onEdit={(p) => openEdit(p as Product)}
          onDelete={handleDelete}
          deleteConfirmId={deleteConfirmId}
          setDeleteConfirmId={setDeleteConfirmId}
        />
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const [state, setState] = useState<"loading" | "locked" | "unlocked">("loading");

  useEffect(() => {
    adminStatus()
      .then(({ unlocked }) => setState(unlocked ? "unlocked" : "locked"))
      .catch(() => setState("locked"));
  }, []);

  if (state === "loading") return <div className="min-h-screen bg-background" />;
  if (state === "locked") return <AccessGate onUnlocked={() => setState("unlocked")} />;
  return <DashboardPanel onLock={() => setState("locked")} />;
}
