import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  createProduct,
  deleteProduct,
  getAnalytics,
  isAdminUnlocked,
  listProducts,
  lockAdmin,
  requireAdmin,
  unlockAdmin,
  updateProduct,
  uploadAsset,
} from "./admin.server";

const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).nullable(),
  price: z.number().min(0),
  old_price: z.number().min(0).nullable(),
  category: z.string().min(1).max(50),
  image_url: z.string().max(1000).nullable(),
  image_url_2: z.string().max(1000).nullable(),
  image_url_3: z.string().max(1000).nullable(),
  file_url: z.string().max(2000).nullable(),
  product_type: z.enum(["my_product", "affiliate"]),
  affiliate_url: z.string().max(2000).nullable(),
});

export const adminStatus = createServerFn({ method: "GET" }).handler(async () => ({
  unlocked: await isAdminUnlocked(),
}));

export const adminUnlock = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ password: z.string().max(200) }).parse(data))
  .handler(async ({ data }) => ({ ok: await unlockAdmin(data.password) }));

export const adminLock = createServerFn({ method: "POST" }).handler(async () => {
  await lockAdmin();
  return { ok: true as const };
});

export const adminListProducts = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  return listProducts();
});

export const adminAnalytics = createServerFn({ method: "POST" }).handler(async () => {
  await requireAdmin();
  return getAnalytics();
});

export const adminCreateProduct = createServerFn({ method: "POST" })
  .inputValidator((data) => productSchema.parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    return createProduct(data);
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .inputValidator((data) => productSchema.extend({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { id, ...rest } = data;
    return updateProduct(id, rest);
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await requireAdmin();
    await deleteProduct(data.id);
    return { ok: true as const };
  });

export const adminUploadAsset = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        prefix: z.enum(["images", "files"]),
        fileName: z.string().min(1).max(200),
        contentType: z.string().min(1).max(120),
        // base64 payload, capped at ~30MB encoded
        dataBase64: z.string().min(1).max(40_000_000),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    return uploadAsset(data);
  });
