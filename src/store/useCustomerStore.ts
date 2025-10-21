import { create } from "zustand";
import type { Customer } from "../types/business.types";

interface CustomerStore {
  customers: Customer[];
  filteredCustomers: Customer[];
  selectedCustomers: React.Key[];

  // Actions
  setCustomers: (data: Customer[]) => void;
  setSeletedCustomers: (data: React.Key[]) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
  deleteCustomer: (id: number) => void;
  deleteSelectedCustomers: () => void;
  clearCustomers: () => void;

  // Filters
  filterByStatus: (status: Customer["status"] | "all") => void;
  searchByTerm: (term: string) => void;
  resetFilters: () => void;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  filteredCustomers: [],
  selectedCustomers: [],

  setCustomers: (data) =>
    set({
      customers: data,
      filteredCustomers: data,
    }),

  setSeletedCustomers: (data) =>
    set({
      selectedCustomers: data,
    }),

  addCustomer: (customer) =>
    set((state) => ({
      customers: [...state.customers, customer],
      filteredCustomers: [...state.filteredCustomers, customer],
    })),

  updateCustomer: (id, updates) =>
    set((state) => ({
      customers: state.customers.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      ),
      filteredCustomers: state.filteredCustomers.map((c) =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      ),
    })),

  deleteSelectedCustomers: () =>
    set((state) => {
      const newArrayCustomers = state.customers.filter(
        (customer) => !state.selectedCustomers.includes(customer.id!)
      );

      return {
        customers: newArrayCustomers,
        filteredCustomers: newArrayCustomers,
        selectedCustomers: [],
      };
    }),

  deleteCustomer: (id) =>
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
      filteredCustomers: state.filteredCustomers.filter((c) => c.id !== id),
    })),

  clearCustomers: () => set({ customers: [], filteredCustomers: [] }),

  filterByStatus: (status) => {
    const { customers } = get();
    if (status === "all") {
      set({ filteredCustomers: customers });
    } else {
      set({
        filteredCustomers: customers.filter((c) => c.status === status),
      });
    }
  },

  searchByTerm: (term) => {
    const { customers } = get();
    const lowerTerm = term.toLowerCase();

    set({
      filteredCustomers: customers.filter(
        (c) =>
          c.name.toLowerCase().includes(lowerTerm) ||
          c.lastname.toLowerCase().includes(lowerTerm) ||
          c.email.toLowerCase().includes(lowerTerm) ||
          c.phone.toLowerCase().includes(lowerTerm) ||
          c.dni.toLowerCase().includes(lowerTerm) ||
          c.code.toLowerCase().includes(lowerTerm)
      ),
    });
  },

  resetFilters: () => {
    const { customers } = get();
    set({ filteredCustomers: customers });
  },
}));
