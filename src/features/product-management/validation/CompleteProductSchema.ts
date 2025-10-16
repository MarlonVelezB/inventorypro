// schemas_nested.ts (Esquemas para tipos de arrays/objetos anidados)
import * as yup from "yup";
import type { Product } from "../../../types/business.types";

// Esquema para la estructura Price
export const PriceSchema = yup.object({
  label: yup.string().required("La etiqueta es requerida."),
  amount: yup
    .number()
    .typeError("Debe ser un número válido.")
    .positive("El monto debe ser positivo.")
    .required("El monto es requerido."),
  currency: yup.string().required("La moneda es requerida."),
});

// Esquema para la estructura ProductImage
export const ProductImageSchema = yup.object({
  url: yup
    .string()
    .url("Debe ser una URL válida.")
    .required("La URL es requerida."),
  alt: yup.string().optional(),
  isPrimary: yup.boolean().optional(),
});

// Esquema para la estructura CustomAttribute (Additional Features)
export const CustomAttributeSchema = yup.object({
  key: yup.string().required("La clave es requerida."),
  value: yup.string().required("El valor es requerido."),
});

// Esquema básico para WarehouseStock (para el objeto anidado)
export const WarehouseStockSchema = yup.object({
  warehouseId: yup.string().required(),
  quantity: yup.number().min(0).required(),
  updatedAt: yup.string().required(),
});

export const BasicInfoSchema = yup.object({
  name: yup.string().required("El nombre del producto es obligatorio."),
  description: yup.string().optional(),
  sku: yup.string().required("El SKU es obligatorio."),
  images: yup.array().of(ProductImageSchema).optional(),

  // Incluimos campos calculados/de trazabilidad para que el tipo coincida con Product, pero los hacemos opcionales.
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
});

export const PricingSchema = yup.object({
  cost: yup
    .number()
    .typeError("El costo debe ser un número.")
    .min(0, "El costo no puede ser negativo.")
    .required("El costo es obligatorio."),
  prices: yup
    .array()
    .of(PriceSchema)
    .min(1, "Debe definir al menos un precio de venta.")
    .required("La lista de precios es obligatoria."),
});

export const InventorySchema = yup.object({
  // quantity es calculado, por lo que solo validamos que sea un número.
  quantity: yup
    .number()
    .min(0, "La cantidad debe ser no negativa.")
    .required("La cantidad es obligatoria."),

  minStock: yup
    .number()
    .min(0, "El stock mínimo no puede ser negativo.")
    .optional(),
  maxStock: yup
    .number()
    .min(0, "El stock máximo no puede ser negativo.")
    .optional(),

  // warehouseStocks es un Record<string, WarehouseStock>. Validamos que sea un objeto
  // y la validación de sus claves internas se maneja dentro del componente de la pestaña.
  // Usamos yup.lazy() o yup.object().optional() para manejar el tipo Record<> de forma flexible.
  warehouseStocks: yup.object().optional(),
});

export const FeaturesSchema = yup.object({
  additionalFeatures: yup.array().of(CustomAttributeSchema).optional(),
  status: yup
    .string()
    .oneOf(["ACTIVE", "INACTIVE", "DISCONTINUED"], "Estado no válido.")
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
