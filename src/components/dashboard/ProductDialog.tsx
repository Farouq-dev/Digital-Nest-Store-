import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, Image, FileText, X, Link as LinkIcon } from "lucide-react";
import { adminUploadAsset } from "@/lib/admin.functions";
import { toast } from "sonner";

export interface ProductForm {
  name: string;
  description: string;
  price: string;
  old_price: string;
  category: string;
  image_url: string;
  image_url_2: string;
  image_url_3: string;
  file_url?: string;
  product_type: "my_product" | "affiliate";
  affiliate_url?: string;
}

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: ProductForm;
  setForm: (form: ProductForm) => void;
  editingId: string | null;
  saving: boolean;
  onSave: () => void;
  onReset: () => void;
}

const ProductDialog = ({ open, onOpenChange, form, setForm, editingId, saving, onSave, onReset }: ProductDialogProps) => {
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const imageInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToStorage = async (file: File, prefix: "images" | "files") => {
    const buffer = await file.arrayBuffer();
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const { url } = await adminUploadAsset({
      data: {
        prefix,
        fileName: file.name,
        contentType: file.type || "application/octet-stream",
        dataBase64: btoa(binary),
      },
    });
    return url;
  };


  const imageFields: Array<"image_url" | "image_url_2" | "image_url_3"> = ["image_url", "image_url_2", "image_url_3"];

  const handleImageUpload = (index: number) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setUploadingImage(index);
    try {
      const url = await uploadToStorage(file, "images");
      setForm({ ...form, [imageFields[index]]: url });
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error("Image upload failed: " + err.message);
    }
    setUploadingImage(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const url = await uploadToStorage(file, "files");
      setForm({ ...form, file_url: url });
      toast.success("File uploaded");
    } catch (err: any) {
      toast.error("File upload failed: " + err.message);
    }
    setUploadingFile(false);
  };

  const imageLabels = ["Cover Image 1 (Main)", "Cover Image 2", "Cover Image 3"];

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) onReset(); }}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{editingId ? "Edit Product" : "New Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* Product Type Toggle */}
          <div className="space-y-2">
            <Label>Product Type</Label>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                type="button"
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  form.product_type === "my_product"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setForm({ ...form, product_type: "my_product", affiliate_url: "" })}
              >
                <Upload className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                My Product
              </button>
              <button
                type="button"
                className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                  form.product_type === "affiliate"
                    ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setForm({ ...form, product_type: "affiliate", file_url: "" })}
              >
                <LinkIcon className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Affiliate Product
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {form.product_type === "my_product"
                ? "Upload your own digital file. Customers pay via PayPal and receive the file."
                : "Paste an external affiliate link. Customers are redirected to the external site to purchase."}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Price ($)</Label>
              <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="9.99" />
            </div>
            <div className="space-y-2">
              <Label>Old Price ($)</Label>
              <Input type="number" step="0.01" min="0" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} placeholder="19.99" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Course">Course</SelectItem>
                  <SelectItem value="Template">Template</SelectItem>
                  <SelectItem value="Tool">Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Uploads - 3 slots */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5"><Image className="w-4 h-4" /> Product Images (up to 3)</Label>
            <div className="grid grid-cols-3 gap-3">
              {imageFields.map((field, index) => (
                <div key={field} className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">{imageLabels[index]}</p>
                  {form[field] ? (
                    <div className="relative rounded-md overflow-hidden border border-border">
                      <img src={form[field]} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 w-5 h-5"
                        onClick={() => setForm({ ...form, [field]: "" })}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-border rounded-md p-3 text-center cursor-pointer hover:border-accent transition-colors h-24 flex flex-col items-center justify-center"
                      onClick={() => imageInputRefs[index].current?.click()}
                    >
                      <Upload className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        {uploadingImage === index ? "Uploading…" : "Upload"}
                      </p>
                    </div>
                  )}
                  <input ref={imageInputRefs[index]} type="file" accept="image/*" className="hidden" onChange={handleImageUpload(index)} />
                </div>
              ))}
            </div>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="Or paste main image URL"
              className="text-xs"
            />
          </div>

          {/* Conditional: Digital File Upload OR Affiliate URL */}
          {form.product_type === "my_product" ? (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> Digital File (PDF, ZIP, etc.)</Label>
              {form.file_url ? (
                <div className="flex items-center gap-2 p-2 bg-secondary rounded-md border border-border">
                  <FileText className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm text-foreground truncate flex-1">File uploaded</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 shrink-0"
                    onClick={() => setForm({ ...form, file_url: "" })}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:border-accent transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {uploadingFile ? "Uploading…" : "Click to upload digital file"}
                  </p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload} />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="flex items-center gap-1.5"><LinkIcon className="w-4 h-4" /> Affiliate Link (e.g. JVZoo, ClickBank)</Label>
              <Input
                value={form.affiliate_url || ""}
                onChange={(e) => setForm({ ...form, affiliate_url: e.target.value })}
                placeholder="https://www.jvzoo.com/..."
                type="url"
              />
              <p className="text-xs text-muted-foreground">
                Customers will be redirected to this link to complete their purchase externally.
              </p>
            </div>
          )}

          <Button className="w-full" onClick={onSave} disabled={saving || uploadingImage !== null || uploadingFile}>
            {saving ? "Saving…" : editingId ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
