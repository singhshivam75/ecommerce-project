"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { CategoriesAPI } from "../../lib/categories.api";
import { ProductsAPI } from "../../lib/products.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "./form/productSchema";
import { buildProductPayload } from "./form/transforms/buildProductPayload";
import BasicInfoSection from "./form/sections/BasicInfoSection";
import MediaSection from "./form/sections/MediaSection";
import SeoSection from "./form/sections/SeoSection";
import TagsSection from "./form/sections/TagsSection";
import StatusSection from "./form/sections/StatusSection";
import InventorySection from "./form/sections/InventorySection";
import PricingSection from "./form/sections/PricingSection";
import ShippingSection from "./form/sections/ShippingSection";

type Props = Readonly<{ product?: any; isEdit?: boolean }>;

export default function ProductForm({ product, isEdit }: Props) {
  const router = useRouter();
  // Fetch nested category tree from the backend
  const [categoriesTree, setCategoriesTree] = React.useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await CategoriesAPI.getTree();
        // Log for verification
        console.log("CATEGORY TREE", res.data);
        const data = res.data?.data ?? res.data ?? [];

        // Normalize ids to strings but preserve children as-is
        const normalize = (nodes: any[]): any[] => {
          return (Array.isArray(nodes) ? nodes : []).map((n: any) => ({
            ...n,
            id: String(n.id),
            name: n.name || n.title || `Category ${n.id}`,
            parentId: n.parentId ?? n.parent?.id ?? null,
            children: n.children && Array.isArray(n.children) ? normalize(n.children) : [],
          }));
        };

        if (mounted) setCategoriesTree(normalize(data));
      } catch (e) {
        console.error('Failed to fetch category tree', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const normalizedCategories = useMemo(() => categoriesTree, [categoriesTree]);

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      slug: '',
      brand: "",
      description: "",
      shortDescription: "",
      basePrice: undefined,
      comparePrice: undefined,
      costPrice: undefined,
      discountType: undefined,
      discountValue: undefined,
      saleStartDate: undefined,
      saleEndDate: undefined,
      images: [{ url: '', isPrimary: true }],
      tags: [],
      seoTitle: '',
      seoDescription: '',
      metaKeywords: [],
      searchKeywords: [],
      videoUrl: undefined,
      status: 'draft',
      featured: false,
      isNewArrival: false,
      isActive: true,
      sku: '',
      barcode: '',
      stock: undefined,
      lowStockThreshold: undefined,
      weight: undefined,
      // dimensions removed, backend expects length/width/height
      length: undefined,
      width: undefined,
      height: undefined,
      shippingClass: '',
      countryOfOrigin: '',
      warranty: '',
      returnPolicy: '',
      specifications: [],
      variants: [],
    },
  });

  useEffect(() => {
    if (!product) return;
    // map the server product into form defaults
    try {
      // lazy import to avoid cycle
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { mapProductToForm } = require('./form/transforms/mapProductToForm');
      const mapped = mapProductToForm(product);
      methods.reset(mapped as any);
    } catch (e) {
      console.error('mapProductToForm failed', e);
    }
  }, [product]);

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    try {
      console.log('FORM VALUES', values);
      console.log('IS EDIT', isEdit);
      console.log('CURRENT PRODUCT', product);
      // Ensure status is valid before sending to API
      const allowedStatuses = ['draft', 'published', 'archived', 'out_of_stock'];
      const safeStatus = allowedStatuses.includes(values.status) ? values.status : 'draft';

      // Log category values for debugging (backend will validate UUIDs)
      console.log('CATEGORY VALUES', {
        categoryId: (values as any).categoryId,
        subCategoryId: (values as any).subCategoryId,
      });
      // Explicit subcategory debug before payload build/validation
      console.log('SUBCATEGORY VALUE', (values as any).subCategoryId);

      const payload = buildProductPayload({ ...values, status: safeStatus } as any, { forUpdate: !!isEdit });
      if (isEdit) console.log('UPDATE PAYLOAD', payload);
      console.log('FINAL PAYLOAD', payload);

      let productId = product?.id;
      let returnedProduct: any = product;

      console.log('PRODUCT ID BEFORE UPDATE', productId);

      if (isEdit && productId) {
        const res = await ProductsAPI.update(productId, payload);
        console.log('UPDATE RESPONSE RAW', res);
        console.log('UPDATE RESPONSE DATA', res?.data);
        console.log('UPDATE RESPONSE DATA.DATA', res?.data?.data);
        returnedProduct = res?.data?.data || res?.data || returnedProduct;
        console.log('UPDATE RESPONSE', returnedProduct);
      } else {
        const res = await ProductsAPI.create(payload);
        returnedProduct =
          res?.data?.data ||
          res?.data ||
          returnedProduct;

        productId =
          returnedProduct?.id ||
          productId;
        console.log('CREATE RESPONSE', returnedProduct);
      }

      // Update productId from returned product if available, then sync images
      productId = returnedProduct?.id || returnedProduct?.data?.id || productId;
      console.log('PRODUCT ID AFTER UPDATE', productId);

      // Sync images via the Images API: add new images and remove deleted ones.
      console.log('IMAGE SYNC START');
      const serverImages = Array.isArray(returnedProduct?.images)
        ? returnedProduct.images
        : Array.isArray(returnedProduct?.data?.images)
        ? returnedProduct.data.images
        : [];
      console.log('SERVER IMAGES', serverImages);
      console.log('FORM IMAGES', values.images);
      const serverUrls = serverImages.map((i: any) => i.url).filter(Boolean);
      const formUrls = (values.images || []).map((i: any) => i.url).filter(Boolean);
      console.log('FORM URLS', formUrls);
      console.log('SERVER URLS', serverUrls);

      // Add images present in form but not on server
      for (const img of values.images || []) {
        if (!img?.url) continue;
        if (serverUrls.includes(img.url)) continue;
        try {
          console.log('ADDING IMAGE', img);
          console.log('ADD IMAGE PRODUCT ID', productId);
          if (!productId) {
            console.warn('Skipping addImage because productId is falsy', { productId, img });
            continue;
          }
          await ProductsAPI.addImage({ productId, url: img.url, isPrimary: !!img.isPrimary });
        } catch (e) {
          console.warn('Failed to add image', img, e);
        }
      }

      // Delete images that exist on server but were removed in the form
      for (const sImg of serverImages) {
        console.log('DELETE IMAGE SERVER ITEM', sImg);
        console.log('DELETE IMAGE ID', sImg?.id);
        if (!sImg?.id || !sImg?.url) continue;
        if (formUrls.includes(sImg.url)) continue;
        try {
          await ProductsAPI.deleteImage(sImg.id);
        } catch (e) {
          console.warn('Failed to delete image', sImg, e);
        }
      }

      toast.success(isEdit ? 'Updated' : 'Created');
      router.push('/products');
    } catch (err: any) {
      console.error('Product submit error', err);
      // Try to extract backend validation message(s)
      const backend = err?.response?.data;
      if (backend) {
        console.error('Backend error payload:', backend);
        const msg = (Array.isArray(backend.message) ? backend.message.join(', ') : backend.message) || backend.error;
        toast.error(msg || 'Failed to create product');
        return;
      }

      toast.error(err?.response?.data?.message || err?.message || 'Failed to create product');
    }
  };

  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{isEdit ? 'Edit Product' : 'Add Product'}</h1>
            <p className="text-gray-500 text-sm">Create or update a product with advanced options.</p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2 border rounded-lg text-gray-600" onClick={() => router.back()}>
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                console.log("SAVE CLICKED");
                console.log('FORM VALUES', methods.getValues());
                console.log('FORM ERRORS', methods.formState.errors);
                formRef.current?.requestSubmit();
              }}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow"
            >
              Save Product
            </button>
          </div>
        </div>

        <FormProvider {...methods}>
          <form
            ref={formRef}
            onSubmit={methods.handleSubmit(onSubmit, (errors) => {
              console.log("FORM ERRORS", errors);

              const firstError = Object.values(errors)[0] as any;

              if (firstError?.message) {
                toast.error(firstError.message);
              }

              const firstKey = Object.keys(errors)[0];

              if (firstKey) {
                const el = formRef.current?.querySelector(
                  `[name="${firstKey}"]`
                );

                if (el instanceof HTMLElement) {
                  el.focus();
                }
              }
            })}
          >
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <BasicInfoSection categories={normalizedCategories} />
                <PricingSection />
                <SeoSection />
                <InventorySection />
              </div>

              <div className="space-y-6">
                <MediaSection />
                <TagsSection />
                <StatusSection />
                <ShippingSection />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}