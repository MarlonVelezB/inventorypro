export interface Warehouse {
  id: string; // Firestore doc ID (por ejemplo "WH001")
  name: string;
  address: string;
  code: string; // Código único de la bodega
  createdAt: string; // ISO date string
  updatedAt?: string; // opcional
}

export interface WarehouseStock {
  warehouseId: string; // referencia a Warehouse.id
  quantity: number; // cantidad actual en esta bodega
  updatedAt?: string; // ISO date
}

export interface ProductImage {
  id?: number;
  url: string; // Ruta o URL de la imagen
  alt?: string; // Texto alternativo opcional
  isPrimary?: boolean; // Indica si es la imagen principal
}

export interface Price {
  id?: number;
  label: string; // Ejemplo: "Precio Regular", "Precio Mayorista"
  amount: number; // Valor numérico del precio
  currency: string; // Ejemplo: "USD"
}

export interface CustomAttribute {
  key: string; // Nombre de la característica (ej: "Color")
  value: string; // Valor (ej: "Rojo")
}

// Tipos de movimiento en el Kardex
export type MovementType = "IN" | "OUT" | "ADJUSTMENT";

// Movimiento de inventario (registro Kardex subcoleccion dentro de producto)
export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: number;
  warehouseId: string;
  warehouseName?: string;
  reference?: string; // Ej: "Compra", "Venta #1234", "Ajuste manual"
  date: string; // ISO 8601
  balanceAfter: number;
  createdBy?: string;
}

export interface ProductTag {
  value: string
}

export interface Product {
  id: string; // Firestore doc ID
  name: string;
  description: string;
  cost: number;
  sku: string;
  quantity: number; // cantidad total (suma de todas las bodegas)
  prices: Price[]; // uno o más precios posibles
  images?: ProductImage[]; // URLs opcionales
  additionalFeatures?: CustomAttribute[];
  warehouseStocks?: Record<string, WarehouseStock>;
  minStock?: number; // Stock mínimo recomendado
  maxStock?: number; // Stock máximo permitido
  status?: "ACTIVE" | "INACTIVE" | "DISCONTINUED"; // Estados posibles
  tags?: ProductTag[]; // Etiquetas personalizables
  createdAt?: string;
  updatedAt?: string;
}
