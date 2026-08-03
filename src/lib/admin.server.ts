import { createHash, timingSafeEqual } from "node:crypto";
import { useSession } from "@tanstack/react-start/server";
import type { Database } from "@/integrations/supabase/types";

export type AdminSession = { unlocked?: boolean; since?: number };

export const PRODUCT_CATEGORIES = ["PDF", "Course", "Template", "Tool"] as const;

function sessionConfig() {
  const password = process.env["ADMIN_SESSION_SECRET"];
  if (!password) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return {
    password,
    name: "dn-admin",
    maxAge: 60 * 60 * 12,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export function getAdminSession() {
  return useSession<AdminSession>(sessionConfig());
}

/** Constant-time comparison over equal-length digests. */
export function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export async function isAdminUnlocked(): Promise<boolean> {
  const session = await getAdminSession();
  return session.data.unlocked === true;
}

/** Throws before any privileged work runs. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminUnlocked())) throw new Error("Unauthorized");
}

export async function unlockAdmin(rawPassword: string): Promise<boolean> {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected) throw new Error("ADMIN_PASSWORD is not configured");
  if (!rawPassword || !passwordMatches(rawPassword, expected)) return false;
  const session = await getAdminSession();
  await session.update({ unlocked: true, since: Date.now() });
  return true;
}

export async function lockAdmin(): Promise<void> {
  const session = await getAdminSession();
  await session.clear();
}

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export type ProductInput = {
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  file_url: string | null;
  product_type: string;
  affiliate_url: string | null;
};

function clamp(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  return String(value).slice(0, max);
}

export function normalizeProduct(input: ProductInput) {
  const category = (PRODUCT_CATEGORIES as readonly string[]).includes(input.category)
    ? input.category
    : "PDF";
  return {
    name: String(input.name).slice(0, 200),
    description: clamp(input.description, 2000),
    price: Number(input.price),
    old_price: input.old_price === null ? null : Number(input.old_price),
    category,
    image_url: clamp(input.image_url, 1000),
    image_url_2: clamp(input.image_url_2, 1000),
    image_url_3: clamp(input.image_url_3, 1000),
    file_url: clamp(input.file_url, 2000),
    product_type: input.product_type === "affiliate" ? "affiliate" : "my_product",
    affiliate_url: clamp(input.affiliate_url, 2000),
  };
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export async function listProducts(): Promise<ProductRow[]> {
  const db = await admin();
  const { data, error } = await db
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(input: ProductInput): Promise<ProductRow> {
  const db = await admin();
  const { data, error } = await db
    .from("products")
    .insert(normalizeProduct(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, input: ProductInput): Promise<ProductRow> {
  const db = await admin();
  const { data, error } = await db
    .from("products")
    .update(normalizeProduct(input))
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  const db = await admin();
  const { error } = await db.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export type Analytics = {
  totalVisitors: number;
  totalSales: number;
  totalRevenue: number;
  visitorData: { date: string; visitors: number }[];
  salesData: { date: string; sales: number; revenue: number }[];
  categoryData: { name: string; value: number }[];
};

export async function getAnalytics(): Promise<Analytics> {
  const db = await admin();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: pageViews } = await db
    .from("page_views")
    .select("visitor_id, created_at")
    .gte("created_at", since);

  const visitorByDay = new Map<string, Set<string>>();
  const allVisitors = new Set<string>();
  for (const view of pageViews ?? []) {
    allVisitors.add(view.visitor_id);
    const day = view.created_at.slice(0, 10);
    if (!visitorByDay.has(day)) visitorByDay.set(day, new Set());
    visitorByDay.get(day)!.add(view.visitor_id);
  }
  const visitorData = [...visitorByDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, set]) => ({ date: date.slice(5), visitors: set.size }));

  const { data: orders } = await db
    .from("orders")
    .select("quantity, total_price, created_at")
    .gte("created_at", since);

  let totalSales = 0;
  let totalRevenue = 0;
  const salesByDay = new Map<string, { sales: number; revenue: number }>();
  for (const order of orders ?? []) {
    totalSales += order.quantity;
    totalRevenue += Number(order.total_price);
    const day = order.created_at.slice(0, 10);
    const bucket = salesByDay.get(day) ?? { sales: 0, revenue: 0 };
    bucket.sales += order.quantity;
    bucket.revenue += Number(order.total_price);
    salesByDay.set(day, bucket);
  }
  const salesData = [...salesByDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date: date.slice(5), ...value }));

  const { data: products } = await db.from("products").select("category");
  const categoryCount = new Map<string, number>();
  for (const product of products ?? []) {
    categoryCount.set(product.category, (categoryCount.get(product.category) ?? 0) + 1);
  }

  return {
    totalVisitors: allVisitors.size,
    totalSales,
    totalRevenue,
    visitorData,
    salesData,
    categoryData: [...categoryCount.entries()].map(([name, value]) => ({ name, value })),
  };
}

export type UploadInput = {
  prefix: "images" | "files";
  fileName: string;
  contentType: string;
  dataBase64: string;
};

/** Uploads to the private bucket and returns a same-origin proxy URL. */
export async function uploadAsset(input: UploadInput): Promise<{ url: string; path: string }> {
  const db = await admin();
  const ext = (input.fileName.split(".").pop() ?? "bin").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
  const path = `${input.prefix}/${crypto.randomUUID()}.${ext || "bin"}`;
  const bytes = Buffer.from(input.dataBase64, "base64");
  const { error } = await db.storage.from("digital-products").upload(path, bytes, {
    contentType: input.contentType,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return { url: `/api/public/product-files/${path}`, path };
}

/** Signed URL for a stored object, used by the public proxy route. */
export async function signAssetUrl(path: string, expiresIn = 60 * 10): Promise<string | null> {
  const db = await admin();
  const { data, error } = await db.storage.from("digital-products").createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
}
