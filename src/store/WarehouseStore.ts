import { create } from "zustand";
import type { Warehouse } from "../types/business.types";

interface WarehouseStore {
  warehouses: Warehouse[];
  filteredWarehouses: Warehouse[];
  selectedWarehouses: React.Key[];

  // Actions
  setWarehouses: (data: Warehouse[]) => void;
  setSelectedWarehouses: (data: React.Key[]) => void;
  addWarehouse: (warehouse: Warehouse) => void;
  updateWarehouse: (id: string, updates: Partial<Warehouse>) => void;
  deleteWarehouse: (id: string) => void;
  deleteSelectedWarehouses: () => void;
  clearWarehouses: () => void;

  // Filters
  searchByTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useWarehouseStore = create<WarehouseStore>((set, get) => ({
  warehouses: [],
  filteredWarehouses: [],
  selectedWarehouses: [],

  setWarehouses: (data) =>
    set({
      warehouses: data,
      filteredWarehouses: data,
    }),

  setSelectedWarehouses: (data) =>
    set({ selectedWarehouses: data }),

  addWarehouse: (warehouse) =>
    set((state) => ({
      warehouses: [...state.warehouses, warehouse],
      filteredWarehouses: [...state.filteredWarehouses, warehouse],
    })),

  updateWarehouse: (id, updates) =>
    set((state) => ({
      warehouses: state.warehouses.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
      filteredWarehouses: state.filteredWarehouses.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      ),
    })),

  deleteWarehouse: (id) =>
    set((state) => ({
      warehouses: state.warehouses.filter((w) => w.id !== id),
      filteredWarehouses: state.filteredWarehouses.filter((w) => w.id !== id),
    })),

  deleteSelectedWarehouses: () =>
    set((state) => {
      const remaining = state.warehouses.filter(
        (w) => !state.selectedWarehouses.includes(w.id)
      );
      return {
        warehouses: remaining,
        filteredWarehouses: remaining,
        selectedWarehouses: [],
      };
    }),

  clearWarehouses: () =>
    set({ warehouses: [], filteredWarehouses: [], selectedWarehouses: [] }),

  searchByTerm: (term) => {
    const { warehouses } = get();
    const lowerTerm = term.toLowerCase();

    set({
      filteredWarehouses: warehouses.filter(
        (w) =>
          w.name.toLowerCase().includes(lowerTerm) ||
          w.code.toLowerCase().includes(lowerTerm) ||
          w.address.toLowerCase().includes(lowerTerm)
      ),
    });
  },

  resetFilters: () => {
    const { warehouses } = get();
    set({ filteredWarehouses: warehouses });
  },
}));
