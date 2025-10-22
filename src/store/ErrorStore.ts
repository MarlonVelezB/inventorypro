import { create } from "zustand";

interface ErrorState {
  errors: any[];
  submitErrors: (errors: any[]) => void;
}

const useErrorStore = create<ErrorState>((set) => ({
  errors: [],
  submitErrors: (errors: any[]) => set({errors: errors})
}));

export default useErrorStore;