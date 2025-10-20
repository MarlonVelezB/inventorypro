// schemas_nested.ts (Schemas for nested array/object types)
import * as yup from "yup";
import type { Product } from "../../../types/business.types";

// Schema for Price structure
export const PriceSchema = yup.object({
  label: yup.string().required("Label is required."),
  amount: yup
    .number()
    .typeError("Must be a valid number.")
    .positive("Amount must be positive.")
    .required("Amount is required."),
  currency: yup.string().required("Currency is required."),
});

// Schema for ProductImage structure
export const ProductImageSchema = yup.object({
  url: yup
    .string()
    .url("Must be a valid URL.")
    .required("URL is required."),
  alt: yup.string().optional(),
  isPrimary: yup.boolean().optional(),
});

// Schema for CustomAttribute structure (Additional Features)
export const CustomAttributeSchema = yup.object({
  key: yup.string().required("Key is required."),
  value: yup.string().required("Value is required."),
});

// Basic schema for WarehouseStock (for nested object)
export const WarehouseStockSchema = yup.object({
  warehouseId: yup.string().required(),
  quantity: yup.number().min(0).required(),
  updatedAt: yup.string().required(),
});

export const BasicInfoSchema = yup.object({
  name: yup.string().required("Product name is required."),
  description: yup.string().optional(),
  sku: yup.string().required("SKU is required."),
  images: yup.array().of(ProductImageSchema).optional(),

  // Include calculated/tracking fields to match Product type, but optional.
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});

export const PricingSchema = yup.object({
  cost: yup
    .number()
    .typeError("Cost must be a number.")
    .min(0, "Cost cannot be negative.")
    .required("Cost is required."),
  prices: yup
    .array()
    .of(PriceSchema)
    .min(1, "At least one sale price must be defined.")
    .required("Price list is required."),
});

export const InventorySchema = yup.object({
  // quantity is calculated, so only validate it is a number.
  quantity: yup
    .number()
    .min(0, "Quantity must be non-negative.")
    .required("Quantity is required."),

  minStock: yup
    .number()
    .min(0, "Minimum stock cannot be negative.")
    .optional(),
  maxStock: yup
    .number()
    .min(0, "Maximum stock cannot be negative.")
    .optional(),

  // warehouseStocks is a Record<string, WarehouseStock>. We validate it is an object
  // internal keys validation is handled inside the tab component.
  // Use yup.lazy() or yup.object().optional() to handle Record<> type flexibly.
  warehouseStocks: yup.object().optional(),
});

export const FeaturesSchema = yup.object({
  additionalFeatures: yup.array().of(CustomAttributeSchema).optional(),
  status: yup
    .string()
    .oneOf(["ACTIVE", "INACTIVE", "DISCONTINUED"], "Invalid status.")
    .optional(),
  tags: yup.array().of(yup.string()).optional(),
});

export const CombinedProductSchema: yup.ObjectSchema<Product> = yup
  .object()
  .shape({
    // 1. Basic Info
    ...BasicInfoSchema.fields,

    // 2. Pricing
    ...PricingSchema.fields,

    // 3. Inventory
    ...InventorySchema.fields,

    // 4. Features
    ...FeaturesSchema.fields,
  }) as yup.ObjectSchema<Product>;
