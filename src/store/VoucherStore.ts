import { create } from "zustand";
import type { Voucher } from "../types/business.types";

interface VoucherStore {
  vouchers: Voucher[];
  filteredVouchers: Voucher[];
  selectedVouchers: React.Key[];

  // Actions
  setVouchers: (data: Voucher[]) => void;
  setSelectedVouchers: (data: React.Key[]) => void;
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (id: string, updates: Partial<Voucher>) => void;
  deleteVoucher: (id: string) => void;
  deleteSelectedVouchers: () => void;
  clearVouchers: () => void;

  // Filters
  filterByStatus: (status: Voucher["paymentStatus"] | "all") => void;
  searchByTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useVoucherStore = create<VoucherStore>((set, get) => ({
  vouchers: [],
  filteredVouchers: [],
  selectedVouchers: [],

  setVouchers: (data) =>
    set({
      vouchers: data,
      filteredVouchers: data,
    }),

  setSelectedVouchers: (data) =>
    set({ selectedVouchers: data }),

  addVoucher: (voucher) =>
    set((state) => ({
      vouchers: [...state.vouchers, voucher],
      filteredVouchers: [...state.filteredVouchers, voucher],
    })),

  updateVoucher: (id, updates) =>
    set((state) => ({
      vouchers: state.vouchers.map((v) =>
        v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
      ),
      filteredVouchers: state.filteredVouchers.map((v) =>
        v.id === id ? { ...v, ...updates, updatedAt: new Date().toISOString() } : v
      ),
    })),

  deleteSelectedVouchers: () =>
    set((state) => {
      const newArray = state.vouchers.filter(
        (v) => !state.selectedVouchers.includes(v.id!)
      );
      return {
        vouchers: newArray,
        filteredVouchers: newArray,
        selectedVouchers: [],
      };
    }),

  deleteVoucher: (id) =>
    set((state) => ({
      vouchers: state.vouchers.filter((v) => v.id !== id),
      filteredVouchers: state.filteredVouchers.filter((v) => v.id !== id),
    })),

  clearVouchers: () =>
    set({ vouchers: [], filteredVouchers: [], selectedVouchers: [] }),

  filterByStatus: (status) => {
    const { vouchers } = get();
    if (status === "all") {
      set({ filteredVouchers: vouchers });
    } else {
      set({
        filteredVouchers: vouchers.filter((v) => v.paymentStatus === status),
      });
    }
  },

  searchByTerm: (term) => {
    const { vouchers } = get();
    const lowerTerm = term.toLowerCase();

    set({
      filteredVouchers: vouchers.filter(
        (v) =>
          v.invoiceNumber.toLowerCase().includes(lowerTerm) ||
          v.customer.name.toLowerCase().includes(lowerTerm) ||
          v.customer.lastname.toLowerCase().includes(lowerTerm) ||
          v.customer.email.toLowerCase().includes(lowerTerm) ||
          v.customer.dni.toLowerCase().includes(lowerTerm) ||
          v.customer.phone.toLowerCase().includes(lowerTerm)
      ),
    });
  },

  resetFilters: () => {
    const { vouchers } = get();
    set({ filteredVouchers: vouchers });
  },
}));
