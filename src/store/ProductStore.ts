import { create } from "zustand";
import type { Product, ProductTag } from "../types/business.types";

interface ProductStore {
  products: Product[];
  filteredProducts: Product[];
  selectedProducts: React.Key[];

  // Actions
  setProducts: (data: Product[]) => void;
  setSelectedProducts: (data: React.Key[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  deleteSelectedProducts: () => void;
  clearProducts: () => void;

  // Filters
  filterByStatus: (status: Product["status"] | "all") => void;
  searchByTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  filteredProducts: [],
  selectedProducts: [],

  setProducts: (data) =>
    set({
      products: data,
      filteredProducts: data,
    }),

  setSelectedProducts: (data) =>
    set({ selectedProducts: data }),

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, product],
      filteredProducts: [...state.filteredProducts, product],
    })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
      filteredProducts: state.filteredProducts.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  deleteSelectedProducts: () =>
    set((state) => {
      const newArray = state.products.filter(
        (p) => !state.selectedProducts.includes(p.id!)
      );
      return {
        products: newArray,
        filteredProducts: newArray,
        selectedProducts: [],
      };
    }),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
      filteredProducts: state.filteredProducts.filter((p) => p.id !== id),
    })),

  clearProducts: () =>
    set({ products: [], filteredProducts: [], selectedProducts: [] }),

  filterByStatus: (status) => {
    const { products } = get();
    if (status === "all") {
      set({ filteredProducts: products });
    } else {
      set({
        filteredProducts: products.filter((p) => p.status === status),
      });
    }
  },

  searchByTerm: (term) => {
    const { products } = get();
    const lowerTerm = term.toLowerCase();

    set({
      filteredProducts: products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerTerm) ||
          (p.sku?.toLowerCase().includes(lowerTerm) ?? false) ||
          (p.tags?.some((tag: ProductTag) => tag.value.toLowerCase().includes(lowerTerm)) ?? false)
      ),
    });
  },

  resetFilters: () => {
    const { products } = get();
    set({ filteredProducts: products });
  },
}));
