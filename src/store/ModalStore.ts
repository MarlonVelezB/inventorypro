import { create } from "zustand";

interface ModalState {
  modals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  isModalOpen: (modalId: string) => boolean;
}

const useModalStore = create<ModalState>((set, get) => ({
  modals: {},
  
  openModal: (modalId: string) => 
    set((state) => ({
      modals: { ...state.modals, [modalId]: true }
    })),
  
  closeModal: (modalId: string) => 
    set((state) => ({
      modals: { ...state.modals, [modalId]: false }
    })),
  
  isModalOpen: (modalId: string) => {
    return get().modals[modalId] || false;
  }
}));

export default useModalStore;